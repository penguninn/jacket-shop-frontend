import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Star } from "lucide-react";
import { useProductDetail } from "@/features/products/hooks";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { useProductVariantsByProduct } from "../hooks";
import { ProductVariantCreateForm } from "../components/ProductVariantCreateForm";
import { DataTable } from "@/shared/components/data-table/DataTable";
import { columns } from "../components/ProductVariantsTableColumns";
import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

export default function ProductVariantPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const productId = Number(id);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100 });

    const { data: product, isLoading, error } = useProductDetail(productId);
    const { data: variants, isLoading: isVariantsLoading } = useProductVariantsByProduct(productId);

    const table = useReactTable({
        data: variants ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
        },
    });

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

                <div className="flex gap-6">
                    {/* Thumbnail */}
                    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg border bg-muted">
                        {product.thumbnail ? (
                            <img
                                src={product.thumbnail}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                No Img
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
                                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">{product.brand?.name}</span>
                                    <span>•</span>
                                    <span>{product.style?.name}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={product.status} />
                                {product.isFeatured && (
                                    <Badge variant="secondary" className="font-normal">
                                        Featured
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {product.description && (
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                {product.description}
                            </p>
                        )}

                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Package className="h-4 w-4" />
                                <span>{product.soldCount ?? 0} sold</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star className={`h-4 w-4 ${product.ratingAverage && product.ratingAverage > 0 ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                                <span className={product.ratingAverage && product.ratingAverage > 0 ? "font-medium" : "text-muted-foreground"}>
                                    {product.ratingAverage?.toFixed(1) ?? "0.0"}
                                    <span className="ml-1 font-normal text-muted-foreground">
                                        ({product.ratingCount ?? 0} reviews)
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold tracking-tight">Product Variants</h2>
                    <ProductVariantCreateForm productId={productId} />
                </div>

                <DataTable table={table} columns={columns} isLoading={isVariantsLoading} />
            </div>
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
