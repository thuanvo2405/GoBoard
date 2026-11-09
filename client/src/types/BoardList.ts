import type z from "zod";
import type { CreateListSchema } from "@/schemas/list";

export type CreateListInput = z.infer<typeof CreateListSchema>;

export type BoardList = {
    id: number;
    board_id: number;
    name: string;
    position: number;
};
