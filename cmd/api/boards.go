package main

import (
	"net/http"
	"strings"

	"github.com/thuanvo2405/GoBoard/internal/data"
	"github.com/thuanvo2405/GoBoard/internal/validator"
)

func (app *application) createBoardHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name     string `json:"name"`
		IsPublic *bool  `json:"is_public"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := app.contextGetUser(r)

	board := &data.Board{
		UserID: user.ID,
		Name:   strings.TrimSpace(input.Name),
	}

	v := validator.New()

	if input.IsPublic != nil {
		board.IsPublic = *input.IsPublic
	} else {
		v.AddError("is_public", "must be provided")
	}

	if data.ValidateBoard(v, board); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Boards.Insert(board)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"board": board}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) getBoardsHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	boards, err := app.models.Boards.GetAll(user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"boards": boards}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

// func (app *application) getBoardHandler(w http.ResponseWriter, r *http.Request) {
// 	boardID, err := app.readIDParam(r, "boardID")
// 	if err != nil {
// 		app.badRequestResponse(w, r, err)
// 		return
// 	}

// 	board, err := app.models.Boards.GetDetails(boardID)
// 	if err != nil {
// 		switch {
// 		case errors.Is(err, data.ErrRecordNotFound):
// 			app.notFoundResponse(w, r)
// 		default:
// 			app.serverErrorResponse(w, r, err)
// 		}
// 		return
// 	}

// 	err = app.writeJSON(w, http.StatusOK, envelope{"board": board}, nil)
// 	if err != nil {
// 		app.serverErrorResponse(w, r, err)
// 	}
// }

func (app *application) updateBoardHandler(w http.ResponseWriter, r *http.Request) {

}

func (app *application) deleteBoardHandler(w http.ResponseWriter, r *http.Request) {
}
