import { CreateCardSchema } from "@/schemas/card";
import type { Card, CreateCardInput } from "@/types/Card";
import { apiUrl } from "@/constant";
import apiFetch from "@/utils/api";
import type { ListCardOrders } from "@/types/BoardList";

function validateListId(listId: number) {
    if (!Number.isSafeInteger(listId) || listId <= 0) {
        throw new Error("List ID is invalid.");
    }
}

export async function createCard(
    listId: number,
    input: CreateCardInput,
): Promise<Card> {
    validateListId(listId);

    const payload = CreateCardSchema.parse(input);
    const response = await apiFetch(`${apiUrl}/lists/${listId}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
        const message =
            typeof data.error === "string"
                ? data.error
                : data.error?.title || data.error?.description;

        throw new Error(message || "Could not create card. Please try again.");
    }

    return data.card;
}

export async function updateCardOrder(
    boardId: number,
    listId: number,
    cardIds: number[],
): Promise<ListCardOrders> {
    validateListId(listId);

    if (!Number.isSafeInteger(boardId) || boardId <= 0) {
        throw new Error("Board ID is invalid.");
    }

    const response = await apiFetch(`${apiUrl}/boards/${boardId}/cards/order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listId, cardsOrder: cardIds }),
    });

    const data = await response.json();

    if (!response.ok) {
        const message =
            typeof data.error === "string"
                ? data.error
                : data.error?.cardsOrder || data.error?.listId;

        throw new Error(
            message || "Could not update card order. Please try again.",
        );
    }

    return data;
}
