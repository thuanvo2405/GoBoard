import z from "zod";

export const CreateCardSchema = z.object({
    title: z.string().trim().min(1, "Task title is required.").refine(
        (title) => Array.from(title).length <= 100,
        "Task title must not be more than 100 characters.",
    ),
    description: z.string().refine(
        (description) => Array.from(description).length <= 300,
        "Description must not be more than 300 characters.",
    ).optional(),
});
