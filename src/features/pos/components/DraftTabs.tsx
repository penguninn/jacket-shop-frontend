import { useRef, useState } from "react";
import { Plus, X, Edit2, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { usePosStore } from "../hooks/usePosState";
import { Input } from "@/shared/ui/input";

export function DraftTabs() {
    const { tabs, activeTabId, addTab, removeTab, switchTab, updateTabName } = usePosStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleEditStart = (id: string, currentName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(id);
        setEditName(currentName);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleEditSave = () => {
        if (editingId && editName.trim()) {
            updateTabName(editingId, editName.trim());
        }
        setEditingId(null);
        setEditName("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleEditSave();
        if (e.key === "Escape") setEditingId(null);
    };

    return (
        <div className="flex items-center gap-2 border-b bg-muted/20 p-2 overflow-x-auto">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    onClick={() => switchTab(tab.id)}
                    className={cn(
                        "group relative flex items-center gap-2 min-w-[150px] max-w-[200px] h-10 px-3 rounded-t-md text-sm font-medium transition-colors cursor-pointer border user-select-none",
                        activeTabId === tab.id
                            ? "bg-background border-border border-b-background text-primary"
                            : "bg-muted hover:bg-muted/80 border-transparent text-muted-foreground"
                    )}
                >
                    {editingId === tab.id ? (
                        <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                            <Input
                                ref={inputRef}
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onBlur={handleEditSave}
                                onKeyDown={handleKeyDown}
                                className="h-7 px-1 text-xs"
                            />
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleEditSave}>
                                <Check className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between w-full">
                            <span className="truncate">{tab.name}</span>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 hover:bg-muted-foreground/20"
                                    onClick={(e) => handleEditStart(tab.id, tab.name, e)}
                                >
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 hover:bg-destructive/20 hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (tab.items.length === 0 || confirm("Close this drafted order?")) {
                                            removeTab(tab.id);
                                        }
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {tabs.length < 5 && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 shrink-0"
                    onClick={addTab}
                    title="Add new order"
                >
                    <Plus className="h-5 w-5" />
                </Button>
            )}
        </div>
    );
}
