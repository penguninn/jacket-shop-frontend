import { PaymentMethodsTable } from "../components/PaymentMethodsTable";
import { PaymentMethodCreateForm } from "../components/PaymentMethodCreateForm";

export default function PaymentMethodsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Payment Methods</h1>
                    <p className="text-muted-foreground">
                        Manage payment methods and configurations
                    </p>
                </div>
                <PaymentMethodCreateForm />
            </div>
            <PaymentMethodsTable />
        </div>
    );
}
