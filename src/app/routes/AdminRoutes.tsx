import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "@/app/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Products from "@/features/products/pages/ProductsPage";
import Orders from "@/features/orders/pages/admin/OrderManagementPage";
import Users from "@/features/users/pages/UsersPage";
import UserDetail from "@/features/users/pages/UserDetailPage";
import Brands from "@/features/brands/pages/BrandsPage";
import Styles from "@/features/styles/pages/StylesPage";
import Attributes from "@/features/attributes/pages/AttributesPage";
import OrderDetail from "@/features/orders/pages/admin/OrderDetailPage";
import ProductVariant from "@/features/product-variants/pages/ProductVariantPage";
import Coupons from "@/features/coupons/pages/CouponsPage";
import { SalePage } from "@/features/sale";
import PosPage from "@/features/pos/pages/PosPage";
import RequireAuth from "./RequireAuth";
import PaymentMethods from "@/features/payment-methods/pages/PaymentMethodsPage";
import Inventories from "@/features/product-variants/pages/InventoriesPage";
import Reviews from "@/features/reviews/pages/AdminReviewsPage";

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
          path="sales"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <SalePage />
            </RequireAuth>
          }
        />
        <Route
          path="pos"
          element={
            <RequireAuth roles={["ADMIN", "STAFF"]}>
              <PosPage />
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
        <Route
          path="inventories"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <Inventories />
            </RequireAuth>
          }
        />

        <Route
          path="reviews"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <Reviews />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
