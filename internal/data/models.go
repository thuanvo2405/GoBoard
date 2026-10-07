package data

import (
	"database/sql"
	"errors"
)

var (
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
)

type Models struct {
	Users  UserModel
	Tokens TokenModel
	Boards BoardModel
	Lists  ListModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Users:  UserModel{db},
		Tokens: TokenModel{db},
		Boards: BoardModel{db},
		Lists:  ListModel{db},
	}
}
