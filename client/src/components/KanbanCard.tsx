import { useSortable } from "@dnd-kit/react/sortable";
import { Button } from "./ui/button";

export type KanbanCardData = {
    created_at: string;
    description: string;
    id: number;
    list_id: number;
    title: string;
    version: number;
};

type KanbanCardProps = {
    data: KanbanCardData;
    index: number;
    column: string;
};

export default function KanbanCard({ data, index ,column}: KanbanCardProps) {
  const {ref, isDragging} = useSortable({
    id: data.id,
    index,
    type: "item",
    accept: "item",
    group: column,
  });
    return (
      <Button ref={ref} data-dragging={isDragging}>
        {data.title}
        </Button>
    );
}
