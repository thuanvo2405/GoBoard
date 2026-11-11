package data

import (
	"context"
	"database/sql"
	"strings"
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
	v.Check(strings.TrimSpace(card.Title) != "", "title", "must be provided")
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

	tx, err := m.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = tx.QueryRowContext(ctx, query, args...).Scan(&card.ID, &card.CreatedAt, &card.Version)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, `
		INSERT INTO list_card_orders (list_id, card_ids)
		VALUES ($1, ARRAY[$2::bigint])
		ON CONFLICT (list_id)
		DO UPDATE SET card_ids = array_append(
			list_card_orders.card_ids,
			$2::bigint
		)
	`, card.ListID, card.ID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (m *CardModel) GetAll(boardID int64, cards *[]Card) error {
	query := `
		SELECT id, title, description, list_id, created_at, version
		FROM cards
		WHERE list_id IN (
			SELECT id
			FROM lists
			WHERE board_id = $1
		)
	`
	args := []any{boardID}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var card Card
		err := rows.Scan(&card.ID, &card.Title, &card.Description, &card.ListID, &card.CreatedAt, &card.Version)
		if err != nil {
			return err
		}
		*cards = append(*cards, card)
	}

	if err = rows.Err(); err != nil {
		return err
	}

	return nil
}
