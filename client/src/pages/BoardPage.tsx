import { useEffect, useState, useRef } from "react";
import List from "@/components/List";
import { DragDropProvider } from "@dnd-kit/react";
import { Link, useParams } from "react-router";
import CreateListDialog from "@/components/CreateListDialog";
import { useQuery } from "@tanstack/react-query";
import KanbanCard from "@/components/KanbanCard";
import type { Card } from "@/types/Card";
import { move } from "@dnd-kit/helpers";
import { getBoard } from "@/services/boards";

export default function BoardPage() {
    const { boardId } = useParams<{ boardId: string }>();
    const [items, setItems] = useState<Record<string, Card[]>>({});
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const previousItems = useRef(items);
    const { data, isPending, isError } = useQuery({
        queryKey: ["board-data", boardId],
        enabled: Boolean(boardId),
        queryFn: () => {
            if (!boardId) {
                throw new Error("Missing board ID");
            }

            return getBoard(boardId);
        },
    });

    useEffect(() => {
        if (!data) return;

        const nextItems: Record<string, Card[]> = {};

        for (const list of data.board.lists) {
            const order = data.list_card_orders.find(
                (order) => order.list_id === list.id,
            );

            nextItems[String(list.id)] = (order?.card_ids ?? []).flatMap(
                (cardId) => {
                    const card = data.cards.find((card) => card.id === cardId);
                    return card ? [card] : [];
                },
            );
        }

        setItems(nextItems);
        setColumnOrder(data.board.lists.map((list) => String(list.id)));
    }, [data]);

    if (isPending) return <p>Loading...</p>;

    if (isError) return <p>Không tải được dữ liệu.</p>;

    if (!data?.board) {
        return (
            <div className="p-4">
                <p>Board not found.</p>
                <Link to="/home" className="underline">
                    Back to boards
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between gap-4 px-4 pt-4">
                <h1 className="font-semibold">{data.board.name}</h1>
                <CreateListDialog boardId={data.board.id} />
            </div>

            {data.board.lists.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    This board has no lists yet.
                </p>
            )}

            <DragDropProvider
                key={data.board.id}
                onDragStart={() => {
                    previousItems.current = items;
                }}

                onDragOver={(event) => {
                    const { source } = event.operation;

                    if (source?.type === "column") return;

                    setItems((items) => move(items, event));
                }}

                onDragEnd={(event) => {
                    const { source } = event.operation;

                    if (event.canceled) {
                        if (source?.type === "item") {
                            setItems(previousItems.current);
                        }

                        return;
                    }

                    if (source?.type === "column") {
                        setColumnOrder((columns) => move(columns, event));
                    }
                }}
            >
                <div className="flex items-start gap-4 overflow-x-auto p-4">
                    {columnOrder.map((columnId, index) => {
                        const list = data.board.lists.find(
                            (list) => String(list.id) === columnId,
                        );

                        if (!list) return null;

                        return (
                            <List
                                key={list.id}
                                data={{ ...list, board_id: data.board.id }}
                                index={index}
                            >
                                {(items[columnId] ?? []).map(
                                    (card, cardIndex) => (
                                        <KanbanCard
                                            key={card.id}
                                            data={card}
                                            index={cardIndex}
                                            column={columnId}
                                        />
                                    ),
                                )}
                            </List>
                        );
                    })}
                </div>
            </DragDropProvider>
        </>
    );
}
