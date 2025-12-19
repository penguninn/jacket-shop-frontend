
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

interface PurchaseTabsProps {
    currentTab: string;
    onTabChange: (value: string) => void;
}

export const PURCHASE_TABS = [
    { value: "all", label: "All" },
    { value: "to_pay", label: "To Pay" },
    { value: "to_ship", label: "To Ship" },
    { value: "to_receive", label: "To Receive" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "return_refund", label: "Return Refund" },
];

export function PurchaseTabs({ currentTab, onTabChange }: PurchaseTabsProps) {
    return (
        <Tabs value={currentTab} onValueChange={onTabChange} className="w-full bg-white rounded-t-sm">
            <TabsList className="w-full justify-start h-auto p-0 bg-white border-b rounded-none">
                {PURCHASE_TABS.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="border-t-0 border-x-0 flex-1 py-4 px-2 text-sm data-[state=active]:text-[#FF6900] data-[state=active]:border-b-2 data-[state=active]:border-[#FF6900] data-[state=active]:shadow-none rounded-none border-b-2 border-transparent hover:text-[#FF6900] transition-colors"
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}
