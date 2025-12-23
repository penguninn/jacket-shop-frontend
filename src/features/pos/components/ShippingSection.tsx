import { Truck } from "lucide-react";
import { Switch } from "@/shared/ui/switch";
import { Label } from "@/shared/ui/label";
import { usePosStore } from "../hooks/usePosState";
import { Textarea } from "@/shared/ui/textarea";

export function ShippingSection() {
    const { tabs, activeTabId, toggleShipping, setShippingFee } = usePosStore();
    const activeTab = tabs.find((t) => t.id === activeTabId);

    if (!activeTab) return null;

    const { shippingEnabled } = activeTab;

    return (
        <div className="bg-background border rounded-lg shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Truck className="h-4 w-4" /> Shipping
                </h3>
                <div className="flex items-center gap-2">
                    <Label htmlFor="shipping-mode" className="text-xs">Ship to Customer</Label>
                    <Switch
                        id="shipping-mode"
                        checked={shippingEnabled}
                        onCheckedChange={toggleShipping}
                    />
                </div>
            </div>

            {shippingEnabled && (
                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-3 bg-muted/20 border rounded-md text-sm text-center text-muted-foreground">
                        <p>Detailed address selection and shipping fee calculation will go here.</p>
                        <p className="text-xs mt-1">(Requires existing address components)</p>
                    </div>

                    {/* Placeholder for Shipping Fee Manual Override */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs">Shipping Fee</Label>
                            <input
                                type="number"
                                className="w-full border rounded px-2 py-1.5 text-sm"
                                placeholder="0"
                                onChange={(e) => setShippingFee(Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Order Note</Label>
                            <Textarea
                                className="min-h-[2.5rem] py-1 text-xs resize-none"
                                placeholder="Note..."
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
