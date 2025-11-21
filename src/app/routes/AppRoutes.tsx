import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AdminRoutesLoader } from "./AdminRoutesLoader";
import { ClientRoutesLoader } from "./ClientRoutesLoader";

export const routes: RouteObject[] = [
  {
    path: "/*",
    element: <ClientRoutesLoader />,
  },
  {
    path: "/admin/*",
    element: <AdminRoutesLoader />,
  },
  { path: "*", element: <Navigate to="/" replace /> },
];
