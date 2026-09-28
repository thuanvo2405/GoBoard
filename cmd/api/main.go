package main

import (
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
)

const version = "1.0.0"

type config struct {
	port int
	env  string
}

type application struct {
	config config
	logger *slog.Logger
}

func main() {
	var cfg config

	flag.IntVar(&cfg.port, "port", 4000, "Host port")
	flag.StringVar(&cfg.env, "env", "development", "(development|staging|production)")

	flag.Parse()

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	app := &application{
		config: cfg,
		logger: logger,
	}

	svr := &http.Server{
		Addr:     fmt.Sprintf(":%v", app.config.port),
		Handler:  app.routes(),
		ErrorLog: slog.NewLogLogger(logger.Handler(), slog.LevelError),
	}

	app.logger.Info("Server is running", "port", app.config.port)

	err := svr.ListenAndServe()
	logger.Error(err.Error())
	os.Exit(1)
}
