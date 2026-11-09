import { useSortable } from "@dnd-kit/react/sortable";

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
};

export default function KanbanCard({ data, index }: KanbanCardProps) {
    const { ref } = useSortable({ id: data.id, index });

    return (
        <div ref={ref} className="bg-gray-300 p-2 rounded">
            <span>{data.title}</span>
        </div>
    );
}
