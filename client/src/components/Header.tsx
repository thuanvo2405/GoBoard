import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link
                    to="/"
                    className="flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                    <img
                        src="/logo.png"
                        alt="GoBoard logo"
                        className="size-9 object-contain"
                    />

                    <span className="text-xl font-bold tracking-tight">
                        Go<span className="text-primary">Board</span>
                    </span>
                </Link>

                {!isAuthenticated ? (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost">
                            <Link to="/signin">Sign in</Link>
                        </Button>

                        <Button className="rounded-xl px-5 font-semibold">
                            <Link to="/signup">Get started</Link>
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        className="rounded-xl px-5 font-semibold"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                )}
            </div>
        </header>
    );
}
