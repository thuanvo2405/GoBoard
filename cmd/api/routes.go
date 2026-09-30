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

	return app.recoverPanic(app.enableCORS(app.authenticate(router)))
}
