import { useState } from "react";
import CreateListForm from "./CreateListForm";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
type CreateListDialogProps = {
    boardId: number;
};

export default function CreateListDialog({ boardId }: CreateListDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button type="button">Create</Button>} />
            <DialogContent className="gap-5 p-6 sm:max-w-[400px]">
                <DialogHeader className="gap-1.5 pr-6">
                    <DialogTitle className="text-base font-semibold">Create list</DialogTitle>
                    <DialogDescription>Add a column to organize tasks in this board.</DialogDescription>
                </DialogHeader>
                <CreateListForm boardId={boardId} onOpenChange={setOpen} />
            </DialogContent>
        </Dialog>
    );
}
