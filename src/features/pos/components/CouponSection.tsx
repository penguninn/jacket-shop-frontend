import { useState } from "react";
import { Ticket, X, Loader2 } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { formatCurrency } from "@/shared/utils/format";
import type { Order } from "@/features/orders/model";
import { useUpdatePosDraftCoupon } from "../hooks";

interface CouponSectionProps {
    activeDraft: Order | undefined;
}

export function CouponSection({ activeDraft }: CouponSectionProps) {

    const [inputCode, setInputCode] = useState("");
    const { mutate: applyCoupon, isPending: isApplying } = useUpdatePosDraftCoupon();

    const handleApply = () => {
        if (!activeDraft) return;
        applyCoupon({
            id: activeDraft.id,
            couponCode: inputCode,
        });
    };

    const handleRemove = () => {
        if (!activeDraft) return;
        applyCoupon({
            id: activeDraft.id,
            couponCode: undefined,
        });
    };

    if (!activeDraft) {
        return (
            <div className="bg-background border rounded-lg shadow-sm p-4 flex items-center justify-center text-muted-foreground h-[300px]">
                No draft selected
            </div>
        );
    }

    return (
        <div className="bg-background border rounded-lg shadow-sm p-4 space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
                <Ticket className="h-4 w-4" /> Coupon
            </h3>

            {activeDraft?.couponCode ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2 rounded-md">
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-emerald-700">{activeDraft.couponCode}</span>
                        {activeDraft.discount && (
                            <span className="text-xs text-emerald-600">
                                Discount: {formatCurrency(activeDraft.discount)}
                            </span>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={handleRemove}
                        disabled={isApplying}
                    >
                        {isApplying ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                    </Button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <Input
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="text-sm h-9"
                        disabled={isApplying}
                    />
                    <Button
                        size="sm"
                        onClick={handleApply}
                        disabled={!inputCode || isApplying}
                        className="h-9"
                    >
                        {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                </div>
            )}
        </div>
    );
}