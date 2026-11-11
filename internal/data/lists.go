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

func (m *ListModel) GetByBoardID(boardID int64) ([]List, error) {
	query := `
		SELECT id, name, position
		FROM lists
		WHERE board_id = $1
		ORDER BY position, id;
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, boardID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	lists := []List{}
	for rows.Next() {
		var list List
		err := rows.Scan(&list.ID, &list.Name, &list.Position)
		if err != nil {
			return nil, err
		}
		lists = append(lists, list)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return lists, nil
}

func (m *ListModel) IsBoardMember(listID, userID int64) (bool, error) {
	query := `
		SELECT EXISTS (
			SELECT 1
			FROM lists l
			JOIN board_members bm ON bm.board_id = l.board_id
			WHERE l.id = $1 AND bm.user_id = $2
		)
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var ok bool
	err := m.DB.QueryRowContext(ctx, query, listID, userID).Scan(&ok)
	return ok, err
}
