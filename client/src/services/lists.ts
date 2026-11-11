import { apiUrl } from "@/constant";
import { CreateListSchema } from "@/schemas/list";
import type { BoardList, CreateListInput } from "@/types/BoardList";
import apiFetch from "@/utils/api";
import { getBoard } from "./boards";

export async function getLists(boardId: number): Promise<BoardList[]> {
    const { board } = await getBoard(String(boardId));

    return board.lists.map((list) => ({ ...list, board_id: board.id }));
}

export async function createList(
    boardId: number,
    input: CreateListInput,
): Promise<BoardList> {
    if (!Number.isSafeInteger(boardId) || boardId <= 0) {
        throw new Error("Board ID is invalid.");
    }

    const payload = CreateListSchema.parse(input);
    const response = await apiFetch(`${apiUrl}/boards/${boardId}/lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        const message = typeof data.error === "string"
            ? data.error
            : data.error?.name;

        throw new Error(message || "Could not create list. Please try again.");
    }

    return data.list;
}
