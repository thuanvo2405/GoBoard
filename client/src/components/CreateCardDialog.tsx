import { useState } from "react";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CreateCardSchema } from "@/schemas/card";
import { createCard } from "@/services/cards";
import type { CreateCardInput } from "@/types/Card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

type CreateCardDialogProps = {
    boardId: number;
    listId: number;
};

export default function CreateCardDialog({ boardId, listId }: CreateCardDialogProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const form = useForm<CreateCardInput>({
        resolver: zodResolver(CreateCardSchema),
        defaultValues: { title: "", description: "" },
    });
    const mutation = useMutation({
        mutationFn: (input: CreateCardInput) => createCard(listId, input),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ["board-data", String(boardId)],
        }),
    });
    const { isSubmitting } = form.formState;

    async function onSubmit(input: CreateCardInput) {
        try {
            await mutation.mutateAsync(input);
            form.reset();
            setOpen(false);
        } catch (error) {
            form.setError("root", {
                message: error instanceof Error
                    ? error.message
                    : "Could not create card. Please try again.",
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button type="button" variant="ghost" className="mt-3 w-full justify-start">
                        <Plus className="size-4" aria-hidden="true" />
                        Add card
                    </Button>
                }
            />
            <DialogContent className="gap-5 p-6 sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Create card</DialogTitle>
                    <DialogDescription>Add a task to this list.</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} aria-busy={isSubmitting}>
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={`card-title-${listId}`}>Title</FieldLabel>
                                    <Input
                                        {...field}
                                        id={`card-title-${listId}`}
                                        placeholder="e.g. Design the home page"
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={`card-description-${listId}`}>
                                        Description (optional)
                                    </FieldLabel>
                                    <textarea
                                        {...field}
                                        id={`card-description-${listId}`}
                                        rows={4}
                                        placeholder="Add more details..."
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    {form.formState.errors.root && (
                        <p role="alert" className="mt-3 text-sm text-destructive">
                            {form.formState.errors.root.message}
                        </p>
                    )}
                    <DialogFooter className="mt-6 gap-2">
                        <DialogClose render={
                            <Button type="button" variant="outline" disabled={isSubmitting}>
                                Cancel
                            </Button>
                        } />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create card"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
