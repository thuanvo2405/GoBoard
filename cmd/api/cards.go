package main

import (
	"fmt"
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
		Title:  input.Title,
		ListID: listID,
	}

	if input.Description != nil {
		card.Description = *input.Description
	}

	v := validator.New()

	if data.ValidateCard(v, card); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	fmt.Println(card)

}
