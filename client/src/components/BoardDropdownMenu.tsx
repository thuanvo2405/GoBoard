import { EllipsisVertical } from "lucide-react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function BoardDropdownMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="ghost" size="icon" aria-label="Board options">
                        <EllipsisVertical
                            className="size-4 shrink-0"
                            aria-hidden="true"
                        />
                    </Button>
                }
            />
            <DropdownMenuContent>
                <DropdownMenuItem>Rename</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
