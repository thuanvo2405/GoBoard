import { useSortable } from "@dnd-kit/react/sortable";
import type { BoardList } from "@/types/BoardList";
import { CollisionPriority } from "@dnd-kit/abstract";
import type { ReactNode } from "react";
import CreateCardDialog from "./CreateCardDialog";

type ListProps = {
  data: BoardList;
  children: ReactNode | ReactNode[];
  index: number;
};

export default function List({ data, children, index }: ListProps) {
  const { ref } = useSortable({
    id: String(data.id),
    index,
    type: "column",
    accept: ["item", "column"],
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <div className="w-72 shrink-0 rounded-lg bg-gray-100 p-3" ref={ref}>
      <h2 className="mb-3 font-semibold">{data.name}</h2>

      <div className="flex flex-col gap-2 min-h-32">{children}</div>
      <CreateCardDialog boardId={data.board_id} listId={data.id} />
    </div>
  );
}
