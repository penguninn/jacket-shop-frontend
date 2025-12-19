import { lazy } from "react";
export const ClientRoutes = lazy(() => import("./ClientRoutes"));

export const ClientRoutesLoader = () => (
  <ClientRoutes />
);
