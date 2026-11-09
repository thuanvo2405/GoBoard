import { useState } from "react";
import type { KanbanCardData } from "@/components/KanbanCard";
import List from "@/components/List";
import {  mockCards, mockListCardOrders } from "@/mocks/kanban";
import { DragDropProvider } from "@dnd-kit/react";
import { Link, useOutletContext, useParams } from "react-router";
import type { WorkspaceContext } from "@/types/Workspace";
import CreateListDialog from "@/components/CreateListDialog";
import { useQuery } from "@tanstack/react-query";
import { getLists } from "@/services/lists";

export default function BoardPage() {
  const [orders] = useState(mockListCardOrders);
  const { boardId } = useParams();
  const { boards } = useOutletContext<WorkspaceContext>();

  const { data: lists = []} = useQuery({
    queryKey: ["board", boardId],
    queryFn: () => getLists(Number(boardId)),
  })
  console.log(lists);

  const board = boards.find((board) => String(board.id) === boardId);
    if (!board) {
        return (
            <div className="p-4">
                <p>Board not found.</p>
                <Link to="/home" className="underline">Back to boards</Link>
            </div>
        );
    }

    return (
        <DragDropProvider key={board.id}>
            <div className="flex items-center justify-between gap-4 px-4 pt-4">
                <h1 className="font-semibold">{board.name}</h1>
                <CreateListDialog boardId={board.id} />
            </div>

            <div className="flex items-start gap-4 overflow-x-auto p-4">
                {lists.length === 0 && (
                    <p className="text-sm text-muted-foreground">This board has no lists yet.</p>
                )}
                {lists.map((list) => {
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
