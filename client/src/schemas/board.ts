import z from "zod";

export const CreateBoardSchema = z.object({
    title: z.string().trim().min(3).max(30),
    is_public: z.boolean(),
});
