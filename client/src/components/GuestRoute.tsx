import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router";

export default function GuestRoute() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
