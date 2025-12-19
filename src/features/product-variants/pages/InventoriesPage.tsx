import { ProductVariantsTable } from "../components/ProductVariantsTable";


export default function InventoriesPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Inventory Management</h1>
                    <p className="text-muted-foreground">
                        Manage your product variants, prices, and stock levels.
                    </p>
                </div>
            </div>

            <ProductVariantsTable />
        </div>
    );
}
