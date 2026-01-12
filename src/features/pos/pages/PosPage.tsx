import { DraftTabs } from "../components/DraftTabs";
import { CustomerSelector } from "../components/CustomerSelector";
import { ProductSelectionDialog } from "../components/ProductSelectionDialog";
import { PosCartTable } from "../components/PosCartTable";
import { OrderSummary } from "../components/OrderSummary";
import { CouponSection } from "../components/CouponSection";

export default function PosPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <DraftTabs />
            <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden bg-muted/10">
                <div className="col-span-8 flex flex-col gap-4 overflow-hidden h-full">
                    <div className="flex gap-2">
                        <ProductSelectionDialog />
                    </div>

                    <div className="flex-1 overflow-hidden border rounded-md bg-background">
                        <PosCartTable />
                    </div>
                </div>

                <div className="col-span-4 flex flex-col gap-4 overflow-y-auto h-full pb-4">
                    <CustomerSelector />
                    <CouponSection />
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
}

