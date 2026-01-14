import { DraftTabs } from "../components/DraftTabs";
import { CustomerSelector } from "../components/CustomerSelector";
import { ProductSelectionDialog } from "../components/ProductSelectionDialog";
import { PosCartTable } from "../components/PosCartTable";
import { OrderSummary } from "../components/OrderSummary";
import { CouponSection } from "../components/CouponSection";
import { usePosDrafts } from "../hooks";
import { useEffect, useState } from "react";

export default function PosPage() {
    const { data: posDrafts, isLoading } = usePosDrafts();
    const [activeDraftId, setActiveDraftId] = useState<number | null>(null);
    const draftList = posDrafts || [];

    useEffect(() => {
        if (!activeDraftId && draftList.length > 0) {
            setActiveDraftId(draftList[0].id);
        }
    }, [draftList.length, activeDraftId]);
    const activeDraft = draftList.find((d) => d.id === activeDraftId);

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <DraftTabs
                drafts={draftList}
                activeDraftId={activeDraftId}
                onSelectDraft={setActiveDraftId}
                isLoading={isLoading}
            />
            <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden bg-muted/10">
                <div className="col-span-8 flex flex-col gap-4 overflow-hidden h-full">
                    <div className="flex gap-2">
                        <ProductSelectionDialog
                            activeDraft={activeDraft}
                        />
                    </div>

                    <div className="flex-1 overflow-hidden border rounded-md bg-background">
                        <PosCartTable activeDraft={activeDraft} />
                    </div>
                </div>

                <div className="col-span-4 flex flex-col gap-4 overflow-y-auto h-full pb-4">
                    <CustomerSelector activeDraft={activeDraft} />
                    <CouponSection activeDraft={activeDraft} />
                    <OrderSummary activeDraft={activeDraft} />
                </div>
            </div>
        </div>
    );
}

