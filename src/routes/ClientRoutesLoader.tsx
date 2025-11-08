import { lazy, Suspense } from "react";
export const ClientRoutes = lazy(() => import("@/pages/client/ClientRoutes"));

export const ClientRoutesLoader = () => (
  // <Suspense
  //   fallback={
  //     <div className="flex h-screen w-full items-center justify-center">
  //       Loading ...
  //     </div>
  //   }
  // >
  //   <ClientRoutes />
  // </Suspense>
  <ClientRoutes />
);
