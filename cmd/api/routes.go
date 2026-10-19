package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(app.notFoundResponse)
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.HealthcheckHandler)
	router.HandlerFunc(http.MethodPost, "/v1/signup", app.RegisterHandler)
	router.HandlerFunc(http.MethodPost, "/v1/signin", app.CreateAuthenticationTokenHandler)
	router.HandlerFunc(http.MethodPost, "/v1/logout", app.DeleteAuthenticationTokenHandler)
	router.HandlerFunc(http.MethodGet, "/v1/me", app.requireAuthentication(app.CurrentUserHandler))

	//Board
	router.HandlerFunc(http.MethodPost, "/v1/boards", app.requireAuthentication(app.createBoardHandler))
	router.HandlerFunc(http.MethodGet, "/v1/boards", app.requireAuthentication(app.getBoardsHandler))
	// router.HandlerFunc(http.MethodGet, "/v1/boards/:id", app.requireAuthentication(app.getBoardHandler))
	router.HandlerFunc(http.MethodPatch, "/v1/boards/:id", app.requireAuthentication(app.updateBoardHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/boards/:id", app.requireAuthentication(app.deleteBoardHandler))

	//List
	router.HandlerFunc(http.MethodPost, "/v1/boards/:boardID/lists", app.requireAuthentication(app.requireBoardMember(app.createListHandler)))

	//Card
	router.HandlerFunc(http.MethodPost, "/v1/lists/:listID/cards", app.requireAuthentication(app.createCardHandler))

	return app.recoverPanic(app.enableCORS(app.authenticate(router)))
}
