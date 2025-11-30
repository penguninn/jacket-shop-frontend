import { BrandsTable } from "../components/BrandsTable";
import { BrandCreateForm } from "../components/BrandCreateForm";

export default function BrandsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Brands Management</h1>
                    <p className="text-muted-foreground">
                        Manage product brands
                    </p>
                </div>
                <BrandCreateForm />
            </div>
            <BrandsTable />
        </div>
    );
}
