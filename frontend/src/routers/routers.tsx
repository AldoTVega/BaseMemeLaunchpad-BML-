import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { lazy } from "react";

const TokenPage = lazy(() => import("../page/token-page/TokenPage"));

export const routes = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <TokenPage />,
      },
    ],
  },
]);
