import { useState } from "react";
import { Ticket, X, Loader2 } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { usePosStore } from "../hooks/usePosState";
import { useUpdatePosDraft } from "../hooks/usePosApi";
import { toast } from "sonner";
import { formatCurrency } from "@/shared/utils/format";

export function CouponSection() {
    // Correct store and hook usage
    const { currentDraft, setCurrentDraft } = usePosStore();
    const { mutate: updateDraft, isPending: isUpdating } = useUpdatePosDraft();

    const [code, setCode] = useState("");

    if (!currentDraft) {
        return (
            <div className="bg-background border rounded-lg shadow-sm p-4 space-y-4 opacity-50 pointer-events-none">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Ticket className="h-4 w-4" /> Coupon
                </h3>
            </div>
        );
    }

    const appliedCouponCode = currentDraft.couponCode;
    const discount = currentDraft.discount || 0;

    const handleApply = async () => {
        if (!code.trim()) return;

        // Pass coupon code to backend via update draft
        updateDraft({
            id: currentDraft.id,
            data: {
                couponCode: code.trim().toUpperCase()
            }
        }, {
            onSuccess: (updated) => {
                setCurrentDraft(updated);
                toast.success("Coupon applied");
                setCode("");
            },
            onError: (error: any) => {
                toast.error("Failed to apply coupon", {
                    description: error.response?.data?.message || "Invalid coupon or conditions not met"
                });
            }
        });
    };

    const handleRemove = () => {
        updateDraft({
            id: currentDraft.id,
            data: {
                couponCode: null // Sending null to remove coupon
            }
        }, {
            onSuccess: (updated) => {
                setCurrentDraft(updated);
                toast.success("Coupon removed");
            },
            onError: (error: any) => {
                toast.error("Failed to remove coupon", {
                    description: error.response?.data?.message
                });
            }
        });
    };

    return (
        <div className="bg-background border rounded-lg shadow-sm p-4 space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
                <Ticket className="h-4 w-4" /> Coupon
            </h3>

            {appliedCouponCode ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2 rounded-md">
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-emerald-700">{appliedCouponCode}</span>
                        {discount > 0 && (
                            <span className="text-xs text-emerald-600">
                                Discount: {formatCurrency(discount)}
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
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="text-sm h-9"
                        disabled={isUpdating}
                    />
                    <Button
                        size="sm"
                        onClick={handleApply}
                        disabled={!code || isUpdating}
                        className="h-9"
                    >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                </div>
            )}
        </div>
    );
}
