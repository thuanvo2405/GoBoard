package main

import (
	"net/http"

	"github.com/thuanvo2405/GoBoard/internal/data"
	"github.com/thuanvo2405/GoBoard/internal/validator"
)

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
