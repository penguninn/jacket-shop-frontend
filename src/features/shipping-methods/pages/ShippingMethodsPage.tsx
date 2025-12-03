import { ShippingMethodsTable } from "../components/ShippingMethodsTable";
import { ShippingMethodCreateForm } from "../components/ShippingMethodCreateForm";

export default function ShippingMethodsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Shipping Methods</h1>
                    <p className="text-muted-foreground">
                        Manage shipping methods and fees
                    </p>
                </div>
                <ShippingMethodCreateForm />
            </div>
            <ShippingMethodsTable />
        </div>
    );
}
