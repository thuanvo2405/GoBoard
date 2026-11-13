import { useState } from "react";
import { LayoutDashboard, PanelsTopLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NavLink, Outlet, useParams } from "react-router";
import BoardDropdownMenu from "./BoardDropdownMenu";
import CreateBoardDialog from "./CreateBoardDialog";
import type { WorkspaceContext } from "@/types/Workspace";
import { useQuery } from "@tanstack/react-query";
import { getBoards } from "@/services/boards";
import { Button } from "./ui/button";

export default function MainLayout() {
    const { boardId } = useParams();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const {
        data: boards = [],
        isPending,
        error,
    } = useQuery({
        queryKey: ["boards"],
        queryFn: getBoards,
    });

    if (isPending) return <p>Loading...</p>;

    if (error) return <p role="alert">{error.message}</p>;

    return (
        <div className="flex min-h-[calc(100dvh-5rem)]">
            <aside
                className={`shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width,padding] duration-200 motion-reduce:transition-none ${
                    isCollapsed ? "w-16 px-2 py-4" : "w-52 px-3 py-4 sm:w-72"
                }`}
            >
                <div className={`mb-5 flex border-b border-sidebar-border/70 pb-4 ${isCollapsed ? "flex-col items-center gap-3" : "items-center gap-2"}`}>
                    <NavLink
                        to="/home"
                        aria-label="My workspace"
                        title={isCollapsed ? "My workspace" : undefined}
                        className={`flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-sidebar-ring ${isCollapsed ? "justify-center" : "flex-1"}`}
                    >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                            <LayoutDashboard className="size-4" aria-hidden="true" />
                        </div>
                        <div className={isCollapsed ? "sr-only" : "min-w-0"}>
                            <p className="truncate text-sm font-semibold tracking-tight">My workspace</p>
                            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                                A place for your ideas
                            </p>
                        </div>
                    </NavLink>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground [&_svg]:size-4"
                        onClick={() => setIsCollapsed((collapsed) => !collapsed)}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        aria-expanded={!isCollapsed}
                        aria-controls="workspace-navigation"
                    >
                        {isCollapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
                    </Button>
                </div>

                <nav id="workspace-navigation" aria-label="Boards">
                    <div className={isCollapsed ? "sr-only" : "mb-2 flex items-center justify-between px-2"}>
                        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Your boards
                        </h2>
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-sidebar-accent px-1 text-[10px] font-medium text-muted-foreground">
                            {boards.length}
                        </span>
                    </div>
                    <ul className="space-y-1">
                        {boards.map((board) => {
                            const isActive = boardId === String(board.id);

                            return (
                                <li key={board.id}>
                                    <div
                                        className={`flex w-full items-center gap-2 rounded-lg text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring ${isCollapsed ? "p-0" : "px-2 py-1"} ${
                                            isActive
                                                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                                                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                                        }`}
                                    >
                                        <NavLink
                                            to={`/boards/${board.id}`}
                                            title={isCollapsed ? board.name : undefined}
                                            className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-sidebar-ring ${isCollapsed ? "h-10 justify-center" : "min-h-8"}`}
                                        >
                                            {isCollapsed ? (
                                                <PanelsTopLeft className="size-[18px] shrink-0" aria-hidden="true" />
                                            ) : (
                                                <span className="size-3 shrink-0 rounded-sm bg-muted-foreground/40" aria-hidden="true" />
                                            )}
                                            <span className={isCollapsed ? "sr-only" : "min-w-0 flex-1 truncate"}>
                                                {board.name}
                                            </span>
                                        </NavLink>
                                        {isActive && !isCollapsed && <BoardDropdownMenu />}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {isCollapsed && boards.some((board) => String(board.id) === boardId) && (
                        <div className="mt-2 flex justify-center">
                            <BoardDropdownMenu />
                        </div>
                    )}

                    <CreateBoardDialog collapsed={isCollapsed} />
                </nav>
            </aside>

            <div className="min-w-0 flex-1">
                <Outlet
                    context={
                        {
                            boards,
                        } satisfies WorkspaceContext
                    }
                />
            </div>
        </div>
    );
}
