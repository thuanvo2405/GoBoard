import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CreateListSchema } from "@/schemas/list";
import type { CreateListInput } from "@/types/BoardList";
import { Button } from "./ui/button";
import { DialogClose, DialogFooter } from "./ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createList } from "@/services/lists";

type CreateListFormProps = {
    boardId: number;
    onOpenChange: (open: boolean) => void;
};

export default function CreateListForm({ boardId, onOpenChange }: CreateListFormProps) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (data: CreateListInput) => createList(boardId, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["board-data", String(boardId)] }),
    });
    const form = useForm<CreateListInput>({
        resolver: zodResolver(CreateListSchema),
        defaultValues: { name: "" },
    });
    const { isSubmitting } = form.formState;

    async function onSubmit(data: CreateListInput) {
        try {
            await mutation.mutateAsync(data);
            form.reset();
            onOpenChange(false);
        } catch (error) {
            form.setError("name", {
                type: "server",
                message: error instanceof Error ? error.message : "Could not create list. Please try again.",
            });
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} aria-busy={isSubmitting}>
            <FieldGroup>
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="create-list-name">List name</FieldLabel>
                            <Input
                                {...field}
                                id="create-list-name"
                                className="h-9 px-3"
                                placeholder="e.g. In progress"
                                aria-invalid={fieldState.invalid}
                                disabled={isSubmitting}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
            <DialogFooter className="mt-6 gap-2">
                <DialogClose render={
                    <Button type="button" variant="outline" className="h-9 px-3" disabled={isSubmitting}>
                        Cancel
                    </Button>
                } />
                <Button type="submit" className="h-9 px-3" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create list"}
                </Button>
            </DialogFooter>
        </form>
    );
}
