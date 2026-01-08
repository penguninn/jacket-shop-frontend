import { useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { usePosStore } from "../hooks/usePosState";
import { usePosDrafts, useCreatePosDraft, useDeletePosDraft } from "../hooks/usePosApi";
import { toast } from "sonner";
import { formatCurrency } from "@/shared/utils/format";
import { cn } from "@/shared/lib/utils";

export function DraftTabs() {
    const { currentDraft, draftList, setCurrentDraft, setDraftList } = usePosStore();

    const { data: drafts, isLoading, refetch } = usePosDrafts();
    const { mutate: createDraft, isPending: isCreating } = useCreatePosDraft();
    const { mutate: deleteDraft } = useDeletePosDraft();

    // Update local state when drafts are fetched
    useEffect(() => {
        if (drafts) {
            setDraftList(drafts);
            // Also update currentDraft if it exists in the new list
            // Use the current id from the store directly to avoid infinite loop
            const currentId = usePosStore.getState().currentDraft?.id;
            if (currentId) {
                const updated = drafts.find(d => d.id === currentId);
                if (updated) {
                    setCurrentDraft(updated);
                }
            }
        }
    }, [drafts, setDraftList, setCurrentDraft]);



    const handleNewDraft = () => {
        if (draftList.length >= 5) {
            toast.error("Maximum 5 drafts allowed");
            return;
        }

        // Create minimal draft with POS_INSTORE type
        createDraft({
            orderType: "POS_INSTORE",
            items: [], // Empty items array
        }, {
            onSuccess: (newDraft) => {
                toast.success("New draft created");
                setCurrentDraft(newDraft);
                refetch();
            },
            onError: (error: any) => {
                toast.error("Failed to create draft", {
                    description: error.response?.data?.message || "Something went wrong"
                });
            }
        });
    };

    const handleCloseDraft = (draftId: number, e: React.MouseEvent) => {
        e.stopPropagation();

        deleteDraft(draftId, {
            onSuccess: () => {
                toast.success("Draft deleted");
                if (currentDraft?.id === draftId) {
                    setCurrentDraft(null);
                }
                refetch();
            }
        });
    };

    return (
        <div className="border-b bg-background px-4">
            <div className="flex items-center gap-2 overflow-x-auto py-2">
                {/* New Draft Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNewDraft}
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
                {isLoading ? (
                    <div className="text-sm text-muted-foreground">Loading drafts...</div>
                ) : draftList.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        No drafts. Click "New Draft" to start.
                    </div>
                ) : (
                    draftList.map((draft) => (
                        <div
                            key={draft.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setCurrentDraft(draft)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setCurrentDraft(draft);
                                }
                            }}
                            className={cn(
                                "relative px-4 py-2 rounded-t-lg border border-b-0 shrink-0 transition-colors group cursor-pointer select-none",
                                currentDraft?.id === draft.id
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
                                        <span>{draft.details?.length || 0} items</span>
                                        <span>•</span>
                                        <span>{formatCurrency(draft.total || 0)}</span>
                                    </div>
                                </div>

                                {draft.details && draft.details.length > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        {draft.details.length}
                                    </Badge>
                                )}
                            </div>

                            {/* Close button */}
                            <button
                                onClick={(e) => handleCloseDraft(draft.id, e)}
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
