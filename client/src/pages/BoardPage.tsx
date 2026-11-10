import { useEffect, useState } from "react";
import List from "@/components/List";
import { DragDropProvider } from "@dnd-kit/react";
import { Link, useOutletContext, useParams } from "react-router";
import type { WorkspaceContext } from "@/types/Workspace";
import CreateListDialog from "@/components/CreateListDialog";
import { useQuery } from "@tanstack/react-query";
import { getLists } from "@/services/lists";
import { getCards } from "@/services/cards";
import KanbanCard from "@/components/KanbanCard";
import type { Card } from "@/types/Card";
import { move } from "@dnd-kit/helpers";

export default function BoardPage() {
  const { boardId } = useParams();
  const { boards } = useOutletContext<WorkspaceContext>();
  const [items, setItems] = useState<Record<string, Card[]>>({});
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    Object.keys(items),
  );

  console.log(columnOrder);

  const { data, isPending, isError } = useQuery({
    queryKey: ["board-data", boardId],
    enabled: Boolean(boardId),
    queryFn: async () => {
      const lists = await getLists(Number(boardId));
      const items: Record<string, Card[]> = {};

      for (const list of lists) {
        items[list.id] = await getCards(list.id);
      }
      return { lists, items };
    },
  });

  useEffect(() => {
    if (data) {
      setItems(() => data.items);
      setColumnOrder(() => Object.keys(data.items));
    }
  }, [data, boardId]);

  console.log(items);

  const board = boards.find((board) => String(board.id) === boardId);
  if (!board) {
    return (
      <div className="p-4">
        <p>Board not found.</p>
        <Link to="/home" className="underline">
          Back to boards
        </Link>
      </div>
    );
  }

  if (isPending) return <p>Loading...</p>;

  if (isError) return <p>Không tải được dữ liệu.</p>;

  return (
    <>
      <div className="flex items-center justify-between gap-4 px-4 pt-4">
        <h1 className="font-semibold">{board.name}</h1>
        <CreateListDialog boardId={board.id} />
      </div>

      {data.lists.length === 0 && (
        <p className="text-sm text-muted-foreground">
          This board has no lists yet.
        </p>
      )}

      <DragDropProvider
        key={board.id}
        onDragOver={(event) => {
          const { source } = event.operation;

          if (source?.type === "column") return;

          setItems((current) => move(current, event));
        }}
        onDragEnd={(event) => {
          const { source } = event.operation;

          if (event.canceled || source?.type !== "column") return;

          setColumnOrder((columns) => move(columns, event));
        }}
      >
        <div className="flex items-start gap-4 overflow-x-auto p-4">
          {columnOrder.map((columnId, index) => {
            const list = data.lists.find(
              (list) => String(list.id) === columnId,
            );

            if (!list) return null;

            return (
              <List key={list.id} data={list} index={index}>
                {(items[columnId] ?? []).map((card, cardIndex) => (
                  <KanbanCard
                    key={card.id}
                    data={card}
                    index={cardIndex}
                    column={columnId}
                  />
                ))}
              </List>
            );
          })}
        </div>
      </DragDropProvider>
    </>
  );
}
