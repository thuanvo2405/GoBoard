import { useState } from "react";
import { LayoutDashboard } from "lucide-react";
import { Outlet } from "react-router";
import BoardDropdownMenu from "./BoardDropdownMenu";
import CreateBoardDialog from "./CreateBoardDialog";
import { mockBoards } from "@/mocks/boards";
import type { Board } from "@/types/Board";

export default function MainLayout() {
    const [boards, setBoards] = useState<Board[]>(() => [...mockBoards]);
    const [activeBoardId, setActiveBoardId] = useState(boards[0].id);

    function handleBoardCreated(board: Board) {
        setBoards((current) => [...current, board]);
        setActiveBoardId(board.id);
    }

    return (
        <div className="flex min-h-[calc(100dvh-4rem)]">
            <aside className="w-52 shrink-0 border-r border-sidebar-border bg-sidebar p-3 text-sidebar-foreground sm:w-72 sm:p-5">
                <div className="mb-8 flex items-center gap-3 px-2 pt-2">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                        <LayoutDashboard
                            className="size-5"
                            aria-hidden="true"
                        />
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold">My workspace</h1>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            A place for your ideas
                        </p>
                    </div>
                </div>

                <nav aria-label="Boards">
                    <div className="mb-3 flex items-center justify-between px-3">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Your boards
                        </h2>
                        <span className="text-xs text-muted-foreground">
                            {boards.length}
                        </span>
                    </div>
                    <ul className="space-y-1">
                        {boards.map((board) => {
                            const isActive = activeBoardId === board.id;

                            return (
                                <li key={board.id}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveBoardId(board.id)
                                        }
                                        aria-pressed={isActive}
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring ${
                                            isActive
                                                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                                                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                                        }`}
                                    >
                                        <span
                                            className="size-3 shrink-0 rounded-sm bg-muted-foreground/40"
                                            aria-hidden="true"
                                        />
                                        <span className="min-w-0 flex-1 truncate">
                                            {board.name}
                                        </span>
                                        {isActive && <BoardDropdownMenu />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <CreateBoardDialog onBoardCreated={handleBoardCreated} />
                </nav>
            </aside>

            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}
