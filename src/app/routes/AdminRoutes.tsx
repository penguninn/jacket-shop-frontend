import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "@/app/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Products from "@/features/products/pages/ProductsPage";
import Orders from "@/pages/admin/Orders";
import Users from "@/features/users/pages/UsersPage";
import UserDetail from "@/features/users/pages/UserDetailPage";
import Brands from "@/pages/admin/Brands";
import Styles from "@/pages/admin/Styles";
import Attributes from "@/features/attributes/pages/AttributesPage";
import OrderDetail from "@/pages/admin/OrderDetail";
import ProductVariant from "@/features/product-variants/pages/ProductVariantPage";

import PaymentMethods from "@/features/payment-methods/pages/PaymentMethodsPage";
import Coupons from "@/pages/admin/Coupons";
import RequireAuth from "./RequireAuth";
import Categories from "@/features/categories/pages/CategoriesPage";
import CategoryDetailPage from "@/features/categories/pages/CategoryDetailPage";
import Materials from "@/features/materials/pages/MaterialsPage";
import MaterialDetail from "@/features/materials/pages/MaterialDetailPage";
import {
  ShippingMethodsPage as ShippingMethods,
  ShippingMethodDetailPage as ShippingMethodDetail,
} from "@/features/shipping-methods";

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
        <Route path="categories/:id" element={<CategoryDetailPage />} />
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
          path="materials/:id"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <MaterialDetail />
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
          path="shipping-methods/:id"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <ShippingMethodDetail />
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
