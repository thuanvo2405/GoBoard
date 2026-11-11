package main

import (
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

	var cards []data.Card

	err = app.models.Cards.GetAll(boardID, &cards)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"cards": cards}, nil)

}
