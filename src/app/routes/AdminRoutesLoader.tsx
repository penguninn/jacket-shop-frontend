import { lazy, Suspense } from "react";
export const AdminRoutes = lazy(() => import("./AdminRoutes"));

export const AdminRoutesLoader = () => (
  <Suspense
    fallback={
      <div className="flex h-screen w-full items-center justify-center">
        Loading admin...
      </div>
    }
  >
    <AdminRoutes />
  </Suspense>
);
