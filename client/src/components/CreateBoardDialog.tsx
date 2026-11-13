import { useState } from "react";
import type z from "zod";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CreateBoardSchema } from "@/schemas/board";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBoard } from "@/services/boards";
import { useNavigate } from "react-router";

type CreateBoardDialogProps = {
    appearance?: "sidebar" | "primary";
    collapsed?: boolean;
};

export default function CreateBoardDialog({
    appearance = "sidebar",
    collapsed = false,
}: CreateBoardDialogProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: createBoard,
        onSuccess: async (board) => {
            await queryClient.invalidateQueries({ queryKey: ["boards"] });
            form.reset();
            setOpen(false);
            navigate(`/boards/${board.id}`);
        },
    });

    const form = useForm<z.infer<typeof CreateBoardSchema>>({
        resolver: zodResolver(CreateBoardSchema),
        defaultValues: {
            title: "",
            is_public: false,
        },
    });

    function onSubmit(data: z.infer<typeof CreateBoardSchema>) {
        mutation.mutate({
            name: data.title,
            is_public: data.is_public,
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button
                        variant={appearance === "sidebar" ? "ghost" : "default"}
                        aria-label={appearance === "sidebar" ? "Add board" : "Create board"}
                        title={collapsed ? "Add board" : undefined}
                        className={
                            appearance === "sidebar"
                                ? `mt-3 flex w-full items-center gap-3 rounded-lg border border-dashed border-sidebar-border text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring ${collapsed ? "h-11 justify-center p-0" : "px-3 py-3 text-left"}`
                                : undefined
                        }
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        <span className={collapsed && appearance === "sidebar" ? "sr-only" : undefined}>
                            {appearance === "sidebar"
                                ? "Add board"
                                : "Create board"}
                        </span>
                    </Button>
                }
            />
            <DialogContent className="gap-5 p-6 sm:max-w-[400px]">
                <DialogHeader className="gap-1.5 pr-6">
                    <DialogTitle className="text-base font-semibold">
                        Create board
                    </DialogTitle>
                    <DialogDescription>
                        Organize your tasks in a new board.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field>
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="create-board-title">
                                            Board name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="create-board-title"
                                            className="h-9 px-3"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="e.g. Product roadmap"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                        </Field>
                        <Controller
                            name="is_public"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="create-board-visibility">
                                        Visibility
                                    </FieldLabel>
                                    <select
                                        id="create-board-visibility"
                                        name={field.name}
                                        ref={field.ref}
                                        onBlur={field.onBlur}
                                        value={
                                            field.value ? "public" : "private"
                                        }
                                        onChange={(event) =>
                                            field.onChange(
                                                event.target.value === "public",
                                            )
                                        }
                                        aria-invalid={fieldState.invalid}
                                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive"
                                    >
                                        <option value="private">Private</option>
                                        <option value="public">Public</option>
                                    </select>
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    {mutation.isError && (
                        <p role="alert">{mutation.error.message}</p>
                    )}
                    <DialogFooter className="mt-6 gap-2">
                        <DialogClose
                            render={
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            }
                        />
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending
                                ? "Creating..."
                                : "Create board"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
