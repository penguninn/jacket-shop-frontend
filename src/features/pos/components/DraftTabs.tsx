import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { formatCurrency } from "@/shared/utils/format";
import { cn } from "@/shared/lib/utils";

// Dữ liệu giả lập danh sách đơn nháp
const DUMMY_DRAFTS = [
    {
        id: 1,
        customerName: null, // Khách vãng lai
        itemCount: 3,
        total: 1250000,
        isActive: true, // Tab đang chọn
    },
    {
        id: 2,
        customerName: "Nguyen Van A",
        itemCount: 1,
        total: 350000,
        isActive: false,
    },
    {
        id: 3,
        customerName: "Tran Thi B",
        itemCount: 5,
        total: 2100000,
        isActive: false,
    },
];

export function DraftTabs() {
    // Giả lập trạng thái loading hoặc tạo mới
    const isCreating = false;
    const draftList = DUMMY_DRAFTS;

    return (
        <div className="border-b bg-background px-4">
            <div className="flex items-center gap-2 overflow-x-auto py-2">
                {/* New Draft Button */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isCreating || draftList.length >= 5}
                    className="shrink-0"
                >
                    {isCreating ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4 mr-2" />
                            New Draft
                        </>
                    )}
                </Button>

                {/* Draft Tabs */}
                {draftList.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        No drafts. Click "New Draft" to start.
                    </div>
                ) : (
                    draftList.map((draft) => (
                        <div
                            key={draft.id}
                            role="button"
                            tabIndex={0}
                            className={cn(
                                "relative px-4 py-2 rounded-t-lg border border-b-0 shrink-0 transition-colors group cursor-pointer select-none",
                                draft.isActive
                                    ? "bg-background border-border"
                                    : "bg-muted/50 border-transparent hover:bg-muted"
                            )}
                        >
                            <div className="flex items-center gap-3 pr-6">
                                <div className="text-left">
                                    <div className="text-sm font-medium">
                                        {draft.customerName || "Walk-in Customer"}
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                                        <span>{draft.itemCount} items</span>
                                        <span>•</span>
                                        <span>{formatCurrency(draft.total)}</span>
                                    </div>
                                </div>

                                {draft.itemCount > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        {draft.itemCount}
                                    </Badge>
                                )}
                            </div>

                            {/* Close button (Hiện khi hover) */}
                            <button
                                className={cn(
                                    "absolute right-1 top-1/2 -translate-y-1/2",
                                    "w-5 h-5 rounded-sm flex items-center justify-center",
                                    "hover:bg-destructive/10 hover:text-destructive",
                                    "opacity-0 group-hover:opacity-100 transition-opacity"
                                )}
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}

                {/* Draft limit indicator */}
                {draftList.length > 0 && (
                    <div className="text-xs text-muted-foreground ml-auto">
                        {draftList.length}/5 drafts
                    </div>
                )}
            </div>
        </div>
    );
}