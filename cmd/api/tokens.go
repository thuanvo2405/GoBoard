package main

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/thuanvo2405/GoBoard/internal/data"
	"github.com/thuanvo2405/GoBoard/internal/validator"
)

func (app *application) CreateAuthenticationTokenHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := app.readJSON(w, r, &input); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	v := validator.New()

	data.ValidateEmail(v, input.Email)
	data.ValidatePasswordPlaintext(v, input.Password)

	if v.Valid(); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	user, err := app.models.Users.GetByEmail(input.Email)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.invalidCredentialsResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	match, err := user.Password.Matches(input.Password)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if !match {
		app.invalidCredentialsResponse(w, r)
		return
	}

	token, err := app.models.Tokens.New(user.ID, 24*time.Hour, data.ScopeAuthentication)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	err = app.writeJSON(w, http.StatusCreated, envelope{"authentication_token": token}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) DeleteAuthenticationTokenHandler(w http.ResponseWriter, r *http.Request) {
	authorization := r.Header.Get("Authorization")

	if authorization == "" {
		app.invalidAuthenticationTokenResponse(w, r)
		return
	}

	headerParts := strings.Split(authorization, " ")
	if len(headerParts) != 2 || headerParts[0] != "Bearer" {
		app.invalidAuthenticationTokenResponse(w, r)
		return
	}

	token := headerParts[1]

	v := validator.New()

	if data.ValidateTokenPlaintext(v, token); !v.Valid() {
		app.invalidAuthenticationTokenResponse(w, r)
		return
	}

	err := app.models.Tokens.Delete(data.ScopeAuthentication, token)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
