import ClientLayout from "@/layouts/ClientLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Products from "./Products";
import ProductDetail from "./ProductDetail";
import Profile from "./Profile";
import Coupons from "./Coupons";
import Cart from "./Cart";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import RequireAuth from "@/routes/RequireAuth";
import Forbidden from "../Forbidden";
import NotFound from "../NotFound";
import UserLayout from "@/layouts/UserLayout";

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
