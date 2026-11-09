import KanbanCard, { type KanbanCardData } from "./KanbanCard";
import type { BoardList } from "@/types/BoardList";

type ListProps = {
    data: BoardList;
    cards: KanbanCardData[];
    order:
        | {
              list_id: number;
              card_ids: number[];
          }
        | undefined;
};

export default function List({ data, cards }: ListProps) {
    return (
        <div className="w-72 shrink-0 rounded-lg bg-gray-100 p-3">
            <h2 className="mb-3 font-semibold">{data.name}</h2>

            <div className="flex flex-col gap-2">
                {cards.map((card, index) => {
                    return (
                        <KanbanCard key={card.id} data={card} index={index} />
                    );
                })}
            </div>
        </div>
    );
}
