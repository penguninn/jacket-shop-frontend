import ClientLayout from "@/layouts/ClientLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Products from "./Products";
import ProductDetail from "./ProductDetail";
import Orders from "./Orders";
import Profile from "./Profile";
import Coupons from "./Coupons";
import Cart from "./Cart";
import OrderDetail from "./OrderDetail";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import RequireAuth from "@/routes/RequireAuth";
import Forbidden from "../Forbidden";
import NotFound from "../NotFound";

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
        <Route path="coupons" element={<Coupons />} />

        <Route
          path="orders"
          element={
            <RequireAuth>
              <Orders />
            </RequireAuth>
          }
        />
        <Route
          path="orders/:id"
          element={
            <RequireAuth>
              <OrderDetail />
            </RequireAuth>
          }
        />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

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
