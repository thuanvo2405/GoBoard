import { apiUrl } from "@/constant";
import type { Board, BoardDetail } from "@/types/Board";
import apiFetch from "@/utils/api";

type CreateBoardPayload = {
    name: string;
    is_public: boolean;
};

export async function getBoards(): Promise<Board[]> {
    const response = await apiFetch(`${apiUrl}/boards`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch boards");
    }

    return data.boards;
}

export async function getBoard(boardId: number): Promise<BoardDetail> {
    const response = await apiFetch(`${apiUrl}/boards/${boardId}`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch board");
    }

    return data.board;
}

export async function createBoard(payload: CreateBoardPayload): Promise<Board> {
    const response = await apiFetch(`${apiUrl}/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error("Create board failed");
    }

    return data.board;
}
