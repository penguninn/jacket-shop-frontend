import { useQuery } from "@tanstack/react-query";
import { getAllSales } from "../api";
import { SaleTable } from "../components/SaleTable";
import { useState } from "react";
import { SaleFormDialog } from "../components/SaleFormDialog";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";

export default function SalePage() {
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["sales"],
        queryFn: () => getAllSales({ page: 0, size: 50, sortDir: "DESC", sortBy: "createdAt" }),
    });

    return (
        <div className="container mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Sales Management</h1>
                    <p className="text-muted-foreground">
                        Apply and manage sales/discounts on product variants.
                    </p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Sale
                </Button>
            </div>

            <SaleTable data={data?.contents ?? []} isLoading={isLoading} />

            {showCreateDialog && (
                <SaleFormDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                />
            )}
        </div>
    );
}
