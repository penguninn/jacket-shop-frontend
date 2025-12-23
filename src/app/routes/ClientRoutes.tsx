import ClientLayout from "@/app/layouts/ClientLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "@/pages/client/Home";
import Search from "@/pages/client/Search";
import ProductDetail from "@/pages/client/ProductDetail";
import Profile from "@/features/auth/pages/ProfilePage";
import Address from "@/features/address/pages/AddressPage";
import Cart from "@/features/cart/pages/CartPage";
import { CheckoutPage } from "@/features/orders";
import SignIn from "@/features/auth/pages/SignInPage";
import SignUp from "@/features/auth/pages/SignUpPage";
import ForgotPassword from "@/features/auth/pages/ForgotPasswordPage";
import RequireAuth from "./RequireAuth";
import Forbidden from "@/pages/Forbidden";
import NotFound from "@/pages/NotFound";
import UserLayout from "@/app/layouts/UserLayout";
import ChangePassword from "@/features/auth/pages/ChangePasswordPage";
import MyVouchers from "@/features/coupons/pages/MyVouchersPage";
import Purchase from "@/features/orders/pages/PurchasePage";


export default function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route index element={<Home />} />

        <Route path="search" element={<Search />} />
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
          path="checkout"
          element={
            <RequireAuth>
              <CheckoutPage />
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
          <Route path="account/address" element={<Address />} />
          <Route path="account/change-password" element={<ChangePassword />} />
          <Route path="purchase" element={<Purchase />} />
          <Route path="coupons" element={<MyVouchers />} />
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
        <Route
          path="forgot-password"
          element={
            <RequireAuth guestOnly={true}>
              <ForgotPassword />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFound />} />
        <Route path="/forbidden" element={<Forbidden />} />
      </Route>
    </Routes>
  );
}
