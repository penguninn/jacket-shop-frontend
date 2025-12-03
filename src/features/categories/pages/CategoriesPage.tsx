import { CategoriesTable } from "../components/CategoriesTable";
import { CategoryCreateForm } from "../components/CategoryCreateForm";

export default function Categories() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <CategoryCreateForm />
      </div>
      <CategoriesTable />
    </div>
  );
}
