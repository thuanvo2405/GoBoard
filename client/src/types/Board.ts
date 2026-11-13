import type { BoardList, ListCardOrders } from "./BoardList";
import type { Card } from "./Card";

export type BoardDetail = Board & {
    lists: Pick<BoardList, "id" | "name" | "position">[];
};

export type BoardDetailResponse = {
    board: BoardDetail;
    cards: Card[];
    list_card_orders: ListCardOrders[];
};

export type Board = {
    id: number;
    user_id: number;
    name: string;
    created_at: string;
    is_public: boolean;
};
