import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

type Props = {
  children: React.ReactNode;
  roles?: string[];
  guestOnly?: boolean;
  redirectTo?: string;
};

export default function RequireAuth({
  children,
  roles,
  guestOnly,
  redirectTo = "/signin",
}: Props) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  if (guestOnly) {
    if (user) {
      return <Navigate to={"/"} replace />;
    }
    return <>{children}</>;
  }

  if (!user) {
    const to = `${redirectTo}?redirectTo=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={to} replace />;
  }

  if (roles && roles.length > 0) {
    const allowed = roles.includes(user.role ?? "CUSTOMER");
    if (!allowed) return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
}
