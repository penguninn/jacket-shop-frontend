import { useState } from "react";
import { useUpdateProduct } from "@/hooks/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ProductEditForm({ product }: { product: any }) {
  const [open, setOpen] = useState(false);
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
        onSuccess: () => setOpen(false),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
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
            value={form.description}
            onChange={handleChange}
          />
          <Input
            name="imagesJson"
            placeholder="Images JSON"
            value={form.imagesJson}
            onChange={handleChange}
          />
          <select
            name="category"
            value={form.category}
            onChange={handleSelectChange}
            required
          >
            <option value={1}>Category 1</option>
            {/* TODO: Map real categories */}
          </select>
          <select
            name="brand"
            value={form.brand}
            onChange={handleSelectChange}
            required
          >
            <option value={1}>Brand 1</option>
            {/* TODO: Map real brands */}
          </select>
          <select
            name="material"
            value={form.material ?? ""}
            onChange={handleSelectChange}
          >
            <option value="">Select Material</option>
            <option value={1}>Material 1</option>
            {/* TODO: Map real materials */}
          </select>
          <select
            name="style"
            value={form.style ?? ""}
            onChange={handleSelectChange}
          >
            <option value="">Select Style</option>
            <option value={1}>Style 1</option>
            {/* TODO: Map real styles */}
          </select>
          <select
            name="status"
            value={form.status}
            onChange={handleStatusChange}
            required
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <Button type="submit" disabled={updateProduct.isPending}>
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
