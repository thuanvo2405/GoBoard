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

import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import AuthRoute from "./components/AuthRoute";
import GuestRoute from "./components/GuestRoute";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Layout />}>
                <Route index element={<Marketing />} />
                <Route element={<AuthRoute />}>
                    <Route path="home" element={<HomePage />} />
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

export default function App() {
    return (
        <>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
            <Toaster />
        </>
    );
}
