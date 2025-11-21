import ClientLayout from "@/app/layouts/ClientLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "@/pages/client/Home";
import Products from "@/features/products/pages/ClientProductsPage";
import ProductDetail from "@/features/products/pages/ProductDetailPage";
import Profile from "@/features/auth/pages/ProfilePage";
import Coupons from "@/pages/client/Coupons";
import Cart from "@/pages/client/Cart";
import SignIn from "@/features/auth/pages/SignInPage";
import SignUp from "@/features/auth/pages/SignUpPage";
import RequireAuth from "./RequireAuth";
import Forbidden from "@/pages/Forbidden";
import NotFound from "@/pages/NotFound";
import UserLayout from "@/app/layouts/UserLayout";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />

        <Route
          path="cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />

        <Route
          path="user"
          element={
            <RequireAuth>
              <UserLayout />
            </RequireAuth>
          }
        >
          <Route path="account/profile" element={<Profile />} />
          {/* 
          <Route path="account/address" element={<Address />} />
          <Route path="account/change-password" element={<ChangePassword />} />
          <Route path="account/payment" element={<PaymentMethods />} />
          <Route
            path="account/notifications"
            element={<NotificationSettings />}
          />
          <Route path="purchase" element={<MyPurchase />} />
          <Route path="purchase/:id" element={<PurchaseDetail />} />
          */}
          <Route path="coupons" element={<Coupons />} />
          <Route index element={<Navigate to="account/profile" replace />} />
        </Route>

        <Route
          path="signin"
          element={
            <RequireAuth guestOnly={true}>
              <SignIn />
            </RequireAuth>
          }
        />
        <Route
          path="signup"
          element={
            <RequireAuth guestOnly={true}>
              <SignUp />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFound />} />
        <Route path="/forbidden" element={<Forbidden />} />
      </Route>
    </Routes>
  );
}
