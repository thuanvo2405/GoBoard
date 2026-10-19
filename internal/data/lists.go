package data

import (
	"context"
	"database/sql"
	"time"
	"unicode/utf8"

	"github.com/thuanvo2405/GoBoard/internal/validator"
)

type List struct {
	ID       int64  `json:"id"`
	BoardID  int64  `json:"board_id,omitempty"`
	Name     string `json:"name"`
	Position int    `json:"position"`
	Cards    []Card `json:"cards,omitempty"`
}

type ListModel struct {
	DB *sql.DB
}

func ValidateList(v *validator.Validator, list *List) {
	v.Check(list.Name != "", "name", "must be provided")
	v.Check(
		utf8.RuneCountInString(list.Name) <= 36,
		"name",
		"must not be more than 36 characters",
	)
	v.Check(list.BoardID > 0, "board_id", "must be greater than zero")
}

func (m *ListModel) Insert(list *List) error {
	query := `
		INSERT INTO lists (board_id, name, position)
		SELECT $1, $2, COALESCE(MAX(position), 0) + 1
		FROM lists
		WHERE board_id = $1
		RETURNING id, board_id, name, position;
	`

	args := []any{list.BoardID, list.Name}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, args...).Scan(&list.ID, &list.BoardID, &list.Name, &list.Position)
	if err != nil {
		return err
	}

	return nil
}
