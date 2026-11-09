import z from "zod";

export const CreateListSchema = z.object({
    name: z.string().trim().min(1, "List name is required.").refine(
        (name) => Array.from(name).length <= 36,
        "List name must not be more than 36 characters.",
    ),
});
