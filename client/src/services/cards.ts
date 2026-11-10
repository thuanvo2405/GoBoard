import { mockCards, mockListCardOrders } from "@/mocks/kanban";
import { CreateCardSchema } from "@/schemas/card";
import type { Card, CreateCardInput } from "@/types/Card";

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
    await new Promise<void>((resolve) => setTimeout(resolve, 300));
    validateListId(listId);

    const data = CreateCardSchema.parse(input);
    const card: Card = {
        id: Math.max(0, ...cards.map((card) => card.id)) + 1,
        list_id: listId,
        title: data.title,
        description: data.description ?? "",
        created_at: new Date().toISOString(),
        version: 1,
    };

    let order = orders.find((order) => order.list_id === listId);
    if (!order) {
        order = {
            list_id: listId,
            card_ids: cards.filter((card) => card.list_id === listId).map((card) => card.id),
        };
        orders.push(order);
    }

    cards.push(card);
    order.card_ids.push(card.id);

    return { ...card };
}
