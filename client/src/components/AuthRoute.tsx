import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router";

export default function AuthRoute() {
    const { loading, token } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!token) {
        return (
            <Navigate
                to="/signin"
                state={{
                    from: location.pathname,
                    message: "You must be logged in to access this page.",
                }}
                replace
            />
        );
    }

    return <Outlet />;
}
