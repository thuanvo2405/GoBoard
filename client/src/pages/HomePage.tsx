import { useState } from "react";
import type { KanbanCardData } from "@/components/KanbanCard";
import List from "@/components/List";
import { mockLists, mockCards, mockListCardOrders } from "@/mocks/kanban";
import { DragDropProvider } from "@dnd-kit/react";

export default function HomePage() {
    const [orders] = useState(mockListCardOrders);
    console.log(orders);
    return (
        <DragDropProvider>
            <p>Product map</p>

            <div className="flex items-start gap-4 overflow-x-auto p-4">
                {mockLists.map((list) => {
                    const order = orders.find(
                        (order) => order.list_id === list.id,
                    );

                    const orderedCards: KanbanCardData[] = [];

                    if (order) {
                        for (const cardId of order.card_ids) {
                            const card = mockCards.find(
                                (card) => card.id === cardId,
                            );

                            if (card) {
                                orderedCards.push(card);
                            }
                        }
                    }

                    return (
                        <List
                            key={list.id}
                            data={list}
                            cards={orderedCards}
                            order={order}
                        />
                    );
                })}
            </div>
        </DragDropProvider>
    );
}
