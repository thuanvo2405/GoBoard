import { mockCards, mockListCardOrders } from "@/mocks/kanban";
import { CreateCardSchema } from "@/schemas/card";
import type { Card, CreateCardInput } from "@/types/Card";
import { apiUrl } from "@/constant";
import apiFetch from "@/utils/api";

// Shared in-memory storage. Reloading restores the seed data.
const cards: Card[] = mockCards.map((card) => ({ ...card }));
const orders = mockListCardOrders.map((order) => ({
    list_id: order.list_id,
    card_ids: [...order.card_ids],
}));

function validateListId(listId: number) {
    if (!Number.isSafeInteger(listId) || listId <= 0) {
        throw new Error("List ID is invalid.");
    }
}

export async function getCards(listId: number): Promise<Card[]> {
    await new Promise<void>((resolve) => setTimeout(resolve, 300));
    validateListId(listId);

    const order = orders.find((order) => order.list_id === listId);
    const positions = new Map(order?.card_ids.map((id, index) => [id, index]));

    return cards
        .filter((card) => card.list_id === listId)
        .sort((a, b) =>
            (positions.get(a.id) ?? Number.MAX_SAFE_INTEGER)
            - (positions.get(b.id) ?? Number.MAX_SAFE_INTEGER),
        )
        .map((card) => ({ ...card }));
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
        const message = typeof data.error === "string"
            ? data.error
            : data.error?.title || data.error?.description;

        throw new Error(message || "Could not create card. Please try again.");
    }

    return data.card;
}
