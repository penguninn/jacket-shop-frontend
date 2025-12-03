import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useShippingMethodDetail } from "../hooks";
import { Button } from "@/shared/ui/button";
import { ShippingMethodStatusBadge } from "../components/ShippingMethodStatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Skeleton } from "@/shared/ui/skeleton";
import { ShippingMethodOverview } from "../components/ShippingMethodOverview";

export default function ShippingMethodDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const methodId = Number(id);

    const { data: shippingMethod, isLoading, error } = useShippingMethodDetail(methodId);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (error || !shippingMethod) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">
                    <p className="text-red-500">Failed to load shipping method details</p>
                    <Button onClick={() => navigate("/admin/shipping-methods")} className="mt-4">
                        Back to Shipping Methods
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            {/* Header */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/admin/shipping-methods")}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Shipping Methods
                </Button>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {shippingMethod.name}
                        </h1>
                        <div className="mt-2 flex items-center gap-3">
                            <ShippingMethodStatusBadge status={shippingMethod.status} />
                            <div className="text-muted-foreground">
                                Fee: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(shippingMethod.fee)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <ShippingMethodOverview shippingMethod={shippingMethod} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="container mx-auto py-8">
            <Skeleton className="mb-6 h-10 w-32" />
            <Skeleton className="mb-2 h-10 w-96" />
            <Skeleton className="mb-6 h-6 w-64" />
            <Skeleton className="h-96 w-full" />
        </div>
    );
}
