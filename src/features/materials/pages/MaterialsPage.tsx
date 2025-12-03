import { MaterialsTable } from "../components/MaterialsTable";
import { MaterialCreateForm } from "../components/MaterialCreateForm";

export default function MaterialsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Materials Management</h1>
                    <p className="text-muted-foreground">
                        Manage product materials
                    </p>
                </div>
                <MaterialCreateForm />
            </div>
            <MaterialsTable />
        </div>
    );
}
