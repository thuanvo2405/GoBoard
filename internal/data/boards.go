package data

import (
	"context"
	"database/sql"
	"errors"
	"time"
	"unicode/utf8"

	"github.com/thuanvo2405/GoBoard/internal/validator"
)

type Board struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	IsPublic  bool      `json:"is_public"`
	Version   int       `json:"-"`
	Lists     []List    `json:"lists,omitempty"`
}

type BoardModel struct {
	DB *sql.DB
}

var (
	ErrNameRequired     = errors.New("Please provide a name for the board")
	ErrIsPublicRequired = errors.New("Please provide an is_public value for the board")
)

func ValidateBoard(v *validator.Validator, board *Board) {
	v.Check(board.Name != "", "name", "must be provided")
	v.Check(utf8.RuneCountInString(board.Name) <= 50, "name", "must not be more than 36 characters")

}

func (m *BoardModel) Insert(board *Board) error {
	query := `
		INSERT INTO boards (user_id, name, is_public)
		VALUES ($1, $2, $3)
		RETURNING id, user_id, name, created_at, version
	`

	args := []any{board.UserID, board.Name, board.IsPublic}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	tx, err := m.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = m.DB.QueryRowContext(ctx, query, args...).Scan(&board.ID, &board.UserID, &board.Name, &board.CreatedAt, &board.Version)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx,
		`INSERT INTO board_members (user_id, board_id) VALUES ($1, $2)`,
		board.UserID, board.ID,
	)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (m *BoardModel) GetAll(userID int64) ([]*Board, error) {
	query := `
		SELECT id, user_id, name, created_at, version
		FROM boards
		WHERE user_id = $1
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	boards := []*Board{}
	for rows.Next() {
		board := &Board{}
		err := rows.Scan(&board.ID, &board.UserID, &board.Name, &board.CreatedAt, &board.Version)
		if err != nil {
			return nil, err
		}
		boards = append(boards, board)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return boards, nil
}

func (m *BoardModel) GetDetail(id int64) (*Board, error) {
	query := `
		SELECT id, user_id, name, created_at, is_public, version
		FROM boards
		WHERE id = $1
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	board := &Board{}
	err := m.DB.QueryRowContext(ctx, query, id).Scan(&board.ID, &board.UserID, &board.Name, &board.CreatedAt, &board.IsPublic, &board.Version)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrRecordNotFound
		}
		return nil, err
	}

	return board, nil
}

// helper validators
func (m BoardModel) IsMember(boardID, userID int64) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM board_members WHERE board_id = $1 AND user_id = $2)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var ok bool
	err := m.DB.QueryRowContext(ctx, query, boardID, userID).Scan(&ok)
	return ok, err
}

func (m BoardModel) IsOwner(boardID, userID int64) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM boards WHERE id = $1 AND user_id = $2)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var ok bool
	err := m.DB.QueryRowContext(ctx, query, boardID, userID).Scan(&ok)
	return ok, err
}
