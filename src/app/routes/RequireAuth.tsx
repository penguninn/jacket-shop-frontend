import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/app/store/auth";

type Props = {
  children: React.ReactNode;
  roles?: string[];
  guestOnly?: boolean;
  redirectTo?: string;
};

export default function RequireAuth({
  children,
  roles,
  guestOnly = false,
  redirectTo = "/signin",
}: Props) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  if (guestOnly) {
    if (user) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  if (!user) {
    const to = `${redirectTo}?redirectTo=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={to} replace />;
  }

  if (roles && roles.length > 0) {
    // Check if user has at least one of the required roles
    const hasRequiredRole = user.roles?.some((userRole) =>
      roles.includes(userRole.name),
    );

    if (!hasRequiredRole) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return <>{children}</>;
}
