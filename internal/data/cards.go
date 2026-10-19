package data

import (
	"context"
	"database/sql"
	"time"
	"unicode/utf8"

	"github.com/thuanvo2405/GoBoard/internal/validator"
)

type Card struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	Version     int       `json:"version"`
	ListID      int64     `json:"list_id,omitempty"`
}

type CardModel struct {
	DB *sql.DB
}

func ValidateCard(v *validator.Validator, card *Card) {
	v.Check(card.Title != "", "title", "must be provided")
	v.Check(utf8.RuneCountInString(card.Title) <= 100, "title", "must not be more than 100 characters long")
	v.Check(utf8.RuneCountInString(card.Description) <= 300, "description", "must not be more than 300 characters long")
}

func (m *CardModel) Insert(card *Card) error {
	query := `
		INSERT INTO cards (title, description, list_id)
		VALUES ($1, $2, $3)
		RETURNING id, created_at, version
	`

	args := []any{card.Title, card.Description, card.ListID}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, args...).Scan(&card.ID, &card.CreatedAt, &card.Version)
	if err != nil {
		return err
	}

	return nil
}
