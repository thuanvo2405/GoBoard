package main

import (
	"errors"
	"net/http"

	"github.com/thuanvo2405/GoBoard/internal/data"
	"github.com/thuanvo2405/GoBoard/internal/validator"
)

func (app *application) updateListOrderHandler(w http.ResponseWriter, r *http.Request) {
	boardID, err := app.readIDParam(r, "boardID")
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	var input struct {
		ListIDs []int64 `json:"list_ids"`
	}
	if err := app.readJSON(w, r, &input); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	v := validator.New()
	data.ValidateListOrder(v, input.ListIDs)
	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Lists.UpdateOrder(boardID, input.ListIDs)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrInvalidListOrder):
			v.AddError("list_ids", "must contain every list in this board exactly once")
			app.failedValidationResponse(w, r, v.Errors)
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	if err := app.writeJSON(w, http.StatusOK, envelope{"list_ids": input.ListIDs}, nil); err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) createListHandler(w http.ResponseWriter, r *http.Request) {
	boardID, err := app.readIDParam(r, "boardID")
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	var input struct {
		Name string `json:"name"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	list := &data.List{
		BoardID: boardID,
		Name:    input.Name,
	}

	v := validator.New()

	if data.ValidateList(v, list); !v.Valid() {
		app.errorResponse(w, r, http.StatusBadRequest, v.Errors)
		return
	}

	err = app.models.Lists.Insert(list)
	if err != nil {
		app.errorResponse(w, r, http.StatusInternalServerError, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"list": list}, nil)
	if err != nil {
		app.errorResponse(w, r, http.StatusInternalServerError, err)
		return
	}
}
