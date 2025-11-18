import { ProductVariantsTable } from "@/components/admin/tables/productvariant/ProductVariantsTable";
import { ProductVariantCreateForm } from "@/components/admin/forms/ProductVariantCreateForm";

export default function ProductVariant() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Variants Management</h1>
          <p className="text-muted-foreground">
            Manage product variants and their options
          </p>
        </div>
        <ProductVariantCreateForm />
      </div>
      {/* ProductVariantsTable */}
      <ProductVariantsTable />
    </div>
  );
}
