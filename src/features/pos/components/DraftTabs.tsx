import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { formatCurrency } from "@/shared/utils/format";
import { cn } from "@/shared/lib/utils";
import { useCreatePosDraft } from "../hooks";
import type { Order } from "../model/schemas";

interface DraftTabsProps {
    drafts: Order[];
    activeDraftId: number | null;
    onSelectDraft: (id: number) => void;
    isLoading?: boolean;
}

export function DraftTabs({ drafts, activeDraftId, onSelectDraft, isLoading }: DraftTabsProps) {
    const { mutate: createDraft, isPending: isCreating } = useCreatePosDraft();

    const handleCreateDraft = () => {
        createDraft(undefined, {
            onSuccess: (order) => {
                onSelectDraft(order.id);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="border-b bg-background px-4 py-2">
                <div className="flex items-center space-x-2">
                    <div className="h-9 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-9 w-32 bg-muted animate-pulse rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="border-b bg-background px-4">
            <div className="flex items-center gap-2 overflow-x-auto py-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isCreating || drafts.length >= 5}
                    className="shrink-0"
                    onClick={handleCreateDraft}
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

                {drafts.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        No drafts. Click "New Draft" to start.
                    </div>
                ) : (
                    drafts.map((draft) => (
                        <div
                            key={draft.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => onSelectDraft(draft.id)}
                            className={cn(
                                "relative px-4 py-2 rounded-t-lg border border-b-0 shrink-0 transition-colors group cursor-pointer select-none",
                                draft.id === activeDraftId
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
                                        <span>{(draft.details || []).length} items</span>
                                        <span>•</span>
                                        <span>{formatCurrency(draft.total)}</span>
                                    </div>
                                </div>

                                {(draft.details || []).length > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        {(draft.details || []).length}
                                    </Badge>
                                )}
                            </div>

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

                {drafts.length > 0 && (
                    <div className="text-xs text-muted-foreground ml-auto">
                        {drafts.length}/5 drafts
                    </div>
                )}
            </div>
        </div>
    );
}