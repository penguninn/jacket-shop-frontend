import { useState } from "react";
import { useUpdateProduct } from "../hooks/use-update-product";
import type { Product } from "@/entities/product";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";


interface Props {
  product: Product;
  onSuccess?: () => void;
}

export function ProductEditForm({ product, onSuccess }: Props) {
  const [form, setForm] = useState(product);
  const updateProduct = useUpdateProduct();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value ? Number(e.target.value) : undefined,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, status: e.target.value as "ACTIVE" | "INACTIVE" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct.mutate(
      { id: product.id, data: form },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <Input
        name="description"
        placeholder="Description"
        value={form.description || ""}
        onChange={handleChange}
      />
      <Input
        name="imagesJson"
        placeholder="Images JSON"
        value={form.imagesJson || ""}
        onChange={handleChange}
      />
      <select
        name="category"
        value={form.category.id}
        onChange={handleSelectChange}
        required
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
      >
        <option value={form.category.id}>{form.category.name}</option>
        {/* TODO: Map real categories */}
      </select>
      <select
        name="brand"
        value={form.brand.id}
        onChange={handleSelectChange}
        required
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
      >
        <option value={form.brand.id}>{form.brand.name}</option>
        {/* TODO: Map real brands */}
      </select>
      <select
        name="material"
        value={form.material?.id ?? ""}
        onChange={handleSelectChange}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
      >
        <option value="">Select Material</option>
        {form.material && <option value={form.material.id}>{form.material.name}</option>}
        {/* TODO: Map real materials */}
      </select>
      <select
        name="style"
        value={form.style?.id ?? ""}
        onChange={handleSelectChange}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
      >
        <option value="">Select Style</option>
        {form.style && <option value={form.style.id}>{form.style.name}</option>}
        {/* TODO: Map real styles */}
      </select>
      <select
        name="status"
        value={form.status}
        onChange={handleStatusChange}
        required
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
      >
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
      <Button type="submit" disabled={updateProduct.isPending}>
        {updateProduct.isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
