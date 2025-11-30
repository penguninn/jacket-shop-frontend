import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "@/app/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Products from "@/features/products/pages/ProductsPage";
import Orders from "@/pages/admin/Orders";
import Users from "@/features/users/pages/UsersPage";
import UserDetail from "@/features/users/pages/UserDetailPage";
import Categories from "@/pages/admin/Categories";
import Brands from "@/features/brands/pages/BrandsPage";
import Styles from "@/features/styles/pages/StylesPage";
import Attributes from "@/features/attributes/pages/AttributesPage";
import OrderDetail from "@/pages/admin/OrderDetail";
import ProductVariant from "@/features/product-variants/pages/ProductVariantPage";
import ShippingMethods from "@/pages/admin/ShippingMethods";
import PaymentMethods from "@/pages/admin/PaymentMethods";
import Coupons from "@/pages/admin/Coupons";
import Materials from "@/features/materials/pages/MaterialsPage";
import RequireAuth from "./RequireAuth";

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
          path="materials"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <Materials />
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
