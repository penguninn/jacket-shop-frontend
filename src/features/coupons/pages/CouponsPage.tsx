import { CouponsTable } from "../components/CouponsTable";
import { CouponCreateForm } from "../components/CouponCreateForm";

export default function Coupons() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Coupons Management</h1>
                    <p className="text-muted-foreground">
                        Manage discount coupons and promotional codes
                    </p>
                </div>
                <CouponCreateForm />
            </div>
            <CouponsTable />
        </div>
    );
}
