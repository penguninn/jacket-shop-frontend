import { useParams } from "react-router-dom";
import { ProductVariantsTable } from "../components/ProductVariantsTable";
import { ProductVariantCreateForm } from "../components/ProductVariantCreateForm";

export default function ProductVariantPage() {
  const { id } = useParams();
  const productId = id ? parseInt(id) : undefined;

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
      <ProductVariantsTable productId={productId} />
    </div>
  );
}
