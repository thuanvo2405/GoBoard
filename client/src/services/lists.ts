import { mockLists } from "@/mocks/kanban";
import { CreateListSchema } from "@/schemas/list";
import type { BoardList, CreateListInput } from "@/types/BoardList";

// Shared in-memory storage. Reloading restores the seed data.
const lists: BoardList[] = mockLists.map((list) => ({ ...list }));

export async function getLists(boardId: number): Promise<BoardList[]> {
    await new Promise<void>((resolve) => setTimeout(resolve, 300));

    return lists
        .filter((list) => list.board_id === boardId)
        .sort((a, b) => a.position - b.position)
        .map((list) => ({ ...list }));
}

export async function createList(
    boardId: number,
    input: CreateListInput,
): Promise<BoardList> {
    await new Promise<void>((resolve) => setTimeout(resolve, 300));

    if (!Number.isSafeInteger(boardId) || boardId <= 0) {
        throw new Error("Board ID is invalid.");
    }

    const data = CreateListSchema.parse(input);
    const boardLists = lists.filter((list) => list.board_id === boardId);
    const list: BoardList = {
        id: Math.max(0, ...lists.map((list) => list.id)) + 1,
        board_id: boardId,
        name: data.name,
        position: Math.max(-1, ...boardLists.map((list) => list.position)) + 1,
    };

    lists.push(list);

    return { ...list };
}
