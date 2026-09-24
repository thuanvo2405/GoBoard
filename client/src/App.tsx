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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Marketing />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="sign-up" element={<SignUp />} />
    </>,
  ),
);

export default function App() {
  return <RouterProvider router={router} />;
}
