package data

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/lib/pq"
	"github.com/thuanvo2405/GoBoard/internal/validator"
)

var ErrInvalidListOrder = errors.New("invalid list order")

func ValidateListOrder(v *validator.Validator, listIDs []int64) {
	v.Check(listIDs != nil, "list_ids", "must be provided as an array")
	seen := make(map[int64]bool, len(listIDs))
	for _, id := range listIDs {
		v.Check(id > 0, "list_ids", "must contain only positive IDs")
		v.Check(!seen[id], "list_ids", "must not contain duplicate IDs")
		seen[id] = true
	}
}

func (m *ListModel) UpdateOrder(boardID int64, listIDs []int64) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tx, err := m.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var id int64
	err = tx.QueryRowContext(ctx, `SELECT id FROM boards WHERE id = $1 FOR UPDATE`, boardID).Scan(&id)
	if errors.Is(err, sql.ErrNoRows) {
		return ErrRecordNotFound
	}
	if err != nil {
		return err
	}

	rows, err := tx.QueryContext(ctx, `SELECT id FROM lists WHERE board_id = $1 FOR UPDATE`, boardID)
	if err != nil {
		return err
	}
	existing := make(map[int64]bool)
	for rows.Next() {
		if err := rows.Scan(&id); err != nil {
			rows.Close()
			return err
		}
		existing[id] = true
	}
	if err := rows.Err(); err != nil {
		rows.Close()
		return err
	}
	if err := rows.Close(); err != nil {
		return err
	}

	if len(existing) != len(listIDs) {
		return ErrInvalidListOrder
	}
	for _, id := range listIDs {
		if !existing[id] {
			return ErrInvalidListOrder
		}
	}

	_, err = tx.ExecContext(ctx, `
		UPDATE lists AS l
		SET position = ordered.position::integer
		FROM unnest($1::bigint[]) WITH ORDINALITY AS ordered(id, position)
		WHERE l.id = ordered.id AND l.board_id = $2
	`, pq.Array(listIDs), boardID)
	if err != nil {
		return err
	}

	return tx.Commit()
}
