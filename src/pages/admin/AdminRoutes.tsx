import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "./Dashboard";
import Products from "./Products";
import Orders from "./Orders";
import Users from "./Users";
import UserDetail from "./UserDetail";
import Categories from "./Categories";
import Brands from "./Brands";
import Styles from "./Styles";
import Attributes from "./Attributes";
import OrderDetail from "./OrderDetail";
import ProductVariant from "./ProductVariant";
import ShippingMethods from "./ShippingMethods";
import PaymentMethods from "./PaymentMethods";
import Coupons from "./Coupons";
import RequireAuth from "@/routes/RequireAuth";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <RequireAuth roles={["ADMIN", "STAFF"]}>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductVariant />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />

        <Route
          path="brands"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <Brands />
            </RequireAuth>
          }
        />
        <Route
          path="styles"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <Styles />
            </RequireAuth>
          }
        />
        <Route
          path="attributes"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <Attributes />
            </RequireAuth>
          }
        />
        <Route
          path="users"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <Users />
            </RequireAuth>
          }
        />
        <Route
          path="users/:id"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <UserDetail />
            </RequireAuth>
          }
        />
        <Route
          path="coupons"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <Coupons />
            </RequireAuth>
          }
        />
        <Route
          path="shipping-methods"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <ShippingMethods />
            </RequireAuth>
          }
        />
        <Route
          path="payment-methods"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <PaymentMethods />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
