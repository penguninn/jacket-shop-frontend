import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { AlertTriangle, Ban } from "lucide-react";
import type { CartValidationResponse } from "../model";

interface CartValidationIssuesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    issues: CartValidationResponse["issues"];
}

export function CartValidationIssuesDialog({
    open,
    onOpenChange,
    issues,
}: CartValidationIssuesDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Checkout Issues
                    </DialogTitle>
                    <DialogDescription>
                        We found some issues with items in your cart. Please resolve them before proceeding.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    {issues.map((issue, index) => (
                        <div
                            key={`${issue.productVariantId}-${index}`}
                            className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-100"
                        >
                            <div className="flex-shrink-0 mt-0.5">
                                {issue.issueType === "INACTIVE" ? (
                                    <Ban className="h-4 w-4 text-red-500" />
                                ) : (
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {issue.productName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {issue.message}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} variant="outline">
                        Close & Fix
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
