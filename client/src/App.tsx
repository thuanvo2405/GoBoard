import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router";
import { RouterProvider } from "react-router/dom";
import NotFound from "./pages/NotFound";
import Marketing from "./pages/Marketing";
import Layout from "./components/Layout";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/HomePage";
import BoardPage from "./pages/BoardPage";

import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import AuthRoute from "./components/AuthRoute";
import GuestRoute from "./components/GuestRoute";
import MainLayout from "./components/MainLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Layout />}>
                <Route index element={<Marketing />} />
                <Route element={<AuthRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="home" element={<HomePage />} />
                        <Route path="boards/:boardId" element={<BoardPage />} />
                    </Route>
                </Route>
            </Route>

            <Route element={<GuestRoute />}>
                <Route path="signup" element={<SignUp />} />
                <Route path="signin" element={<SignIn />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </>,
    ),
);

const queryClient = new QueryClient();

export default function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
                <Toaster />
            </QueryClientProvider>
        </>
    );
}
