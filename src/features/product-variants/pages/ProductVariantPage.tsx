import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useProductDetail } from "@/features/products/hooks";
import { Button } from "@/shared/ui/button";
import { ProductStatusBadge } from "@/features/products/components/ProductStatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Skeleton } from "@/shared/ui/skeleton";

export default function ProductVariantPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const productId = Number(id);

    const { data: product, isLoading, error } = useProductDetail(productId);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (error || !product) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">
                    <p className="text-red-500">Failed to load product details</p>
                    <Button onClick={() => navigate("/admin/products")} className="mt-4">
                        Back to Products
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
                    onClick={() => navigate("/admin/products")}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Products
                </Button>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {product.name}
                        </h1>
                        <div className="mt-2 flex items-center gap-3">
                            <ProductStatusBadge status={product.status} />
                            <span className="text-muted-foreground">
                                {product.category?.name} • {product.brand?.name}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="variants" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="variants">Variants</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="variants">
                    <div className="rounded-md border p-4">
                        <p className="text-muted-foreground">Product variants management will be implemented here.</p>
                    </div>
                </TabsContent>

                <TabsContent value="details">
                    <div className="rounded-md border p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold">Description</h3>
                                <p className="text-sm text-muted-foreground">{product.description || "No description"}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Attributes</h3>
                                <ul className="text-sm text-muted-foreground">
                                    <li>Material: {product.material?.name || "N/A"}</li>
                                    <li>Style: {product.style?.name || "N/A"}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
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
