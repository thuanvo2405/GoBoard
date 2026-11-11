import { ArrowUpRight, Globe, LayoutDashboard, Lock } from "lucide-react";
import { Link, useOutletContext } from "react-router";
import CreateBoardDialog from "@/components/CreateBoardDialog";
import type { WorkspaceContext } from "@/types/Workspace";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
});

export default function HomePage() {
    const { boards } = useOutletContext<WorkspaceContext>();

    return (
        <section className="mx-auto max-w-6xl space-y-8 p-4 sm:p-8">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        My workspace
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Choose a board to start working, or create a new one.
                    </p>
                </div>
                <CreateBoardDialog appearance="primary" />
            </header>

            {boards.length > 0 ? (
                <div>
                    <h2 className="mb-4 text-sm font-medium">
                        Your boards ({boards.length})
                    </h2>
                    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {boards.map((board) => {
                            const VisibilityIcon = board.is_public
                                ? Globe
                                : Lock;

                            return (
                                <li key={board.id} className="min-w-0">
                                    <Link
                                        to={`/boards/${board.id}`}
                                        className="group flex h-full flex-col gap-5 rounded-xl border bg-card p-5 text-card-foreground transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="rounded-lg bg-primary/10 p-2 text-primary">
                                                <LayoutDashboard
                                                    className="size-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            <ArrowUpRight
                                                className="size-4 text-muted-foreground group-hover:text-foreground"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <h3 className="wrap-break-word font-semibold">
                                            {board.name}
                                        </h3>
                                        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                                            <span className="inline-flex items-center gap-1.5">
                                                <VisibilityIcon
                                                    className="size-3.5"
                                                    aria-hidden="true"
                                                />
                                                {board.is_public
                                                    ? "Public"
                                                    : "Private"}
                                            </span>
                                            <time dateTime={board.created_at}>
                                                Created{" "}
                                                {dateFormatter.format(
                                                    new Date(board.created_at),
                                                )}
                                            </time>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center">
                    <LayoutDashboard
                        className="mb-4 size-10 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <h2 className="text-lg font-semibold">
                        Create your first board
                    </h2>
                    <p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">
                        Keep your ideas and tasks organized in one place. Create
                        a board to get started.
                    </p>
                    <CreateBoardDialog appearance="primary" />
                </div>
            )}
        </section>
    );
}
