import { useQuery } from "@tanstack/react-query";
import { getAllSales } from "../api";
import { SaleTable } from "../components/SaleTable";

export default function SalePage() {
    const { data, isLoading } = useQuery({
        queryKey: ["sales"],
        queryFn: () => getAllSales({ page: 0, size: 50, sortDir: "DESC", sortBy: "createdAt" }),
    });

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Sales Management</h2>
                    <p className="text-muted-foreground">
                        Apply and manage sales/discounts on product variants.
                    </p>
                </div>
            </div>
            <SaleTable data={data?.contents ?? []} isLoading={isLoading} />
        </div>
    );
}
