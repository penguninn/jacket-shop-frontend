import { ProductsTable } from "../components/ProductsTable";
import { ProductCreateForm } from "../components/ProductCreateForm";

export default function ProductsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Products Management</h1>
                    <p className="text-muted-foreground">
                        Manage your product catalog
                    </p>
                </div>
                <ProductCreateForm />
            </div>
            <ProductsTable />
        </div>
    );
}
