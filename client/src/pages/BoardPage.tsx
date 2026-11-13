import { useEffect, useState, useRef } from "react";
import List from "@/components/List";
import { DragDropProvider } from "@dnd-kit/react";
import { Link, useParams } from "react-router";
import CreateListDialog from "@/components/CreateListDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import KanbanCard from "@/components/KanbanCard";
import type { Card } from "@/types/Card";
import { move } from "@dnd-kit/helpers";
import { getBoard } from "@/services/boards";
import { updateListOrder } from "@/services/lists";
import { toast } from "sonner";
import { updateCardOrder } from "@/services/cards";

export default function BoardPage() {
    const { boardId } = useParams<{ boardId: string }>();
    const queryClient = useQueryClient();
    const [items, setItems] = useState<Record<string, Card[]>>({});
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const previousItems = useRef<Record<string, Card[]>>(items);
    const previousColumnOrder = useRef<string[]>([]);

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

    const orderMutation = useMutation({
        mutationFn: (nextOrder: string[]) => {
            return updateListOrder(Number(boardId), nextOrder.map(Number));
        },
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ["board-data", boardId],
                exact: true,
            }),
        onError: () => {
            setColumnOrder(previousColumnOrder.current);
            toast.error("Không thể lưu thứ tự cột.");
        },
    });

    const cardOrderMutation = useMutation({
        mutationFn: (input: { list_id: number; card_ids: number[] }) =>
            updateCardOrder(Number(boardId), input.list_id, input.card_ids),
        onError: () => {
            setItems(previousItems.current);
            toast.error("Không thể lưu thứ tự card.");
        },
    });

    const isPendingAction =
        orderMutation.isPending || cardOrderMutation.isPending;

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
                    previousColumnOrder.current = [...columnOrder];
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

                    if (source?.type === "item") {
                        const changedLists = Object.entries(items)
                            .filter(([listId, cards]) => {
                                const oldCards =
                                    previousItems.current[listId] ?? [];

                                return (
                                    cards.length !== oldCards.length ||
                                    cards.some(
                                        (card, index) =>
                                            card.id !== oldCards[index]?.id,
                                    )
                                );
                            })
                            .map(([listId, cards]) => ({
                                list_id: Number(listId),
                                card_ids: cards.map((card) => card.id),
                            }));

                        if (changedLists.length === 0) return;

                        const order = changedLists[0];
                        if (!order) return;

                        cardOrderMutation.mutate(order);
                    }

                    if (source?.type === "column") {
                        const nextOrder = move(columnOrder, event);

                        if (
                            nextOrder.every(
                                (id, index) => id === columnOrder[index],
                            )
                        ) {
                            return;
                        }

                        setColumnOrder(nextOrder);
                        orderMutation.mutate(nextOrder);
                    }
                }}
            >
                <div
                    inert={isPendingAction}
                    aria-busy={isPendingAction}
                    className={`flex items-start gap-4 overflow-x-auto p-4 transition-opacity ${
                        isPendingAction
                            ? "pointer-events-none opacity-50 grayscale"
                            : ""
                    }`}
                >
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
