import { useState } from "react";
import { Ticket, X, Loader2 } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { formatCurrency } from "@/shared/utils/format";

export function CouponSection() {
    // Giả lập trạng thái có Draft
    const hasDraft = true;

    // State UI cục bộ
    const [inputCode, setInputCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    if (!hasDraft) {
        return (
            <div className="bg-background border rounded-lg shadow-sm p-4 space-y-4 opacity-50 pointer-events-none">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Ticket className="h-4 w-4" /> Coupon
                </h3>
            </div>
        );
    }

    const handleApply = () => {
        if (!inputCode.trim()) return;

        setIsUpdating(true);

        // Giả lập API call delay
        setTimeout(() => {
            setAppliedCoupon({
                code: inputCode.trim().toUpperCase(),
                discount: 50000 // Giả lập giảm 50k
            });
            setIsUpdating(false);
        }, 600);
    };

    const handleRemove = () => {
        setIsUpdating(true);

        // Giả lập API call delay
        setTimeout(() => {
            setAppliedCoupon(null);
            setInputCode("");
            setIsUpdating(false);
        }, 600);
    };

    return (
        <div className="bg-background border rounded-lg shadow-sm p-4 space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
                <Ticket className="h-4 w-4" /> Coupon
            </h3>

            {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2 rounded-md">
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-emerald-700">{appliedCoupon.code}</span>
                        {appliedCoupon.discount > 0 && (
                            <span className="text-xs text-emerald-600">
                                Discount: {formatCurrency(appliedCoupon.discount)}
                            </span>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={handleRemove}
                        disabled={isUpdating}
                    >
                        {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                    </Button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <Input
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="text-sm h-9"
                        disabled={isUpdating}
                    />
                    <Button
                        size="sm"
                        onClick={handleApply}
                        disabled={!inputCode || isUpdating}
                        className="h-9"
                    >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                </div>
            )}
        </div>
    );
}