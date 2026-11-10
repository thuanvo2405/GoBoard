import { useState } from "react";
import { LayoutDashboard } from "lucide-react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router";
import BoardDropdownMenu from "./BoardDropdownMenu";
import CreateBoardDialog from "./CreateBoardDialog";
import { mockBoards } from "@/mocks/boards";
import type { Board } from "@/types/Board";
import type { WorkspaceContext } from "@/types/Workspace";

export default function MainLayout() {
    const [boards, setBoards] = useState<Board[]>(() => [...mockBoards]);
    const { boardId } = useParams();
    const navigate = useNavigate();

    function handleBoardCreated(board: Board) {
        setBoards((current) => [...current, board]);
        navigate(`/boards/${board.id}`);
    }

    return (
        <div className="flex min-h-[calc(100dvh-5rem)]">
            <aside className="w-52 shrink-0 border-r border-sidebar-border bg-sidebar p-3 text-sidebar-foreground sm:w-72 sm:p-5">
                <NavLink to="/home" className="mb-8 flex items-center gap-3 rounded-lg px-2 pt-2 focus-visible:outline-2 focus-visible:outline-sidebar-ring">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                        <LayoutDashboard
                            className="size-5"
                            aria-hidden="true"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">My workspace</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            A place for your ideas
                        </p>
                    </div>
                </NavLink>

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
                            const isActive = boardId === String(board.id);

                            return (
                                <li key={board.id}>
                                    <div
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring ${
                                            isActive
                                                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                                                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                                        }`}
                                    >
                                        <NavLink
                                            to={`/boards/${board.id}`}
                                            className="flex min-w-0 flex-1 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-sidebar-ring"
                                        >
                                            <span
                                                className="size-3 shrink-0 rounded-sm bg-muted-foreground/40"
                                                aria-hidden="true"
                                            />
                                            <span className="min-w-0 flex-1 truncate">
                                                {board.name}
                                            </span>
                                        </NavLink>
                                        {isActive && <BoardDropdownMenu />}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <CreateBoardDialog onBoardCreated={handleBoardCreated} />
                </nav>
            </aside>

            <div className="min-w-0 flex-1">
                <Outlet context={{ boards, onBoardCreated: handleBoardCreated } satisfies WorkspaceContext} />
            </div>
        </div>
    );
}
