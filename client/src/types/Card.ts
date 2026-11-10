import type z from "zod";
import type { CreateCardSchema } from "@/schemas/card";

export type CreateCardInput = z.infer<typeof CreateCardSchema>;

export type Card = {
    id: number;
    list_id: number;
    title: string;
    description: string;
    created_at: string;
    version: number;
};
