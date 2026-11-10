import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button, buttonVariants } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();

    async function handleLogout() {
        setIsLoggingOut(true);
        try {
            await logout();
            navigate("/");
        } catch {
            toast.error("Couldn't sign out. Please try again.");
        } finally {
            setIsLoggingOut(false);
        }
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-card">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-4 sm:gap-10">
                    <Link
                        to={isAuthenticated ? "/home" : "/"}
                        aria-label="GoBoard home"
                        className="shrink-0 rounded-sm text-xl font-semibold tracking-tight transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    >
                        GoBoard
                    </Link>

                </div>

                {!isAuthenticated ? (
                    <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                        <Link to="/signin" className={buttonVariants({ variant: "ghost" })}>
                            Sign in
                        </Link>
                        <Link to="/signup" className={`${buttonVariants()} bg-foreground text-background hover:bg-foreground/85`}>
                            Get started
                        </Link>
                    </div>
                ) : (
                    <div className="flex min-w-0 items-center gap-2 sm:gap-4">
                        <p className="hidden max-w-40 truncate text-sm text-muted-foreground md:block">{user?.name}</p>
                        <Button
                            variant="ghost"
                            className="px-2 text-muted-foreground sm:px-4"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            aria-label={isLoggingOut ? "Signing out" : "Sign out"}
                        >
                            {isLoggingOut && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                            <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
