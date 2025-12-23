import { DraftTabs } from "../components/DraftTabs";
import { CustomerSelector } from "../components/CustomerSelector";
import { ProductSelectionDialog } from "../components/ProductSelectionDialog";
import { PosCartTable } from "../components/PosCartTable";
import { ShippingSection } from "../components/ShippingSection";
import { OrderSummary } from "../components/OrderSummary";
// import { usePosStore } from "../hooks/usePosState";

export default function PosPage() {
    // const activeTabId = usePosStore((state) => state.activeTabId);
    // const activeTab = usePosStore((state) => state.tabs.find(t => t.id === activeTabId));

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            {/* Top Bar with Tabs */}
            <DraftTabs />

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden bg-muted/10">
                {/* Left Side: Cart & Actions (8 cols) */}
                <div className="col-span-8 flex flex-col gap-4 overflow-hidden h-full">
                    {/* Toolbar / Actions */}
                    <div className="flex gap-2">
                        <ProductSelectionDialog />
                    </div>

                    {/* Cart Table - Takes remaining space */}
                    <div className="flex-1 overflow-hidden border rounded-md bg-background">
                        <PosCartTable />
                    </div>
                </div>

                <div className="col-span-4 flex flex-col gap-4 overflow-y-auto h-full pb-4">
                    <CustomerSelector />
                    <ShippingSection />
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
}
