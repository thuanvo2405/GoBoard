package data

import (
	"context"
	"time"

	"github.com/lib/pq"
)

type ListCardOrder struct {
	ListID  int64   `json:"list_id"`
	CardIDs []int64 `json:"card_ids"`
}

func (m *ListModel) GetCardOrders(boardID int64) ([]ListCardOrder, error) {
	query := `
		SELECT l.id, COALESCE(o.card_ids, '{}'::bigint[])
		FROM lists l
		LEFT JOIN list_card_orders o ON o.list_id = l.id
		WHERE l.board_id = $1
		ORDER BY l.position, l.id;
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, boardID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	orders := []ListCardOrder{}
	for rows.Next() {
		order := ListCardOrder{CardIDs: []int64{}}
		if err := rows.Scan(&order.ListID, pq.Array(&order.CardIDs)); err != nil {
			return nil, err
		}
		orders = append(orders, order)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return orders, nil
}
