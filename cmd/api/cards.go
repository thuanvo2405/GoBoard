package main

import (
	"errors"
	"net/http"

	"github.com/thuanvo2405/GoBoard/internal/data"
	"github.com/thuanvo2405/GoBoard/internal/validator"
)

func (app *application) createCardHandler(w http.ResponseWriter, r *http.Request) {
	listID, err := app.readIDParam(r, "listID")
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	var input struct {
		Title       string  `json:"title"`
		Description *string `json:"description"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	card := &data.Card{
		Title:       input.Title,
		Description: "",
		ListID:      listID,
	}

	if input.Description != nil {
		card.Description = *input.Description
	}

	v := validator.New()

	if data.ValidateCard(v, card); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Cards.Insert(card)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"card": card}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) getCardsHandler(w http.ResponseWriter, r *http.Request) {
	boardID, err := app.readIDParam(r, "boardID")
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	cards := []data.Card{}

	err = app.models.Cards.GetAll(boardID, &cards)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	orders, err := app.models.Lists.GetCardOrders(boardID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{
		"cards":            cards,
		"list_card_orders": orders,
	}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updateCardOrderHandler(w http.ResponseWriter, r *http.Request) {
	boardID, err := app.readIDParam(r, "boardID")
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	var input struct {
		ListID     int64   `json:"listId"`
		CardsOrder []int64 `json:"cardsOrder"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	v := validator.New()
	if data.ValidateCardOrder(v, input); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Cards.UpdateOrder(boardID, input.ListID, input.CardsOrder)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		case errors.Is(err, data.ErrInvalidCardOrder):
			v.AddError("cardsOrder", "must contain every card in this list exactly once")
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	if err := app.writeJSON(w, http.StatusOK, envelope{
		"list_id":  input.ListID,
		"card_ids": input.CardsOrder,
	}, nil); err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
