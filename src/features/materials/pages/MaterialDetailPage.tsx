import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useMaterialDetail } from "../hooks";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Skeleton } from "@/shared/ui/skeleton";
import { MaterialOverviewTab } from "../components/MaterialOverviewTab";

export default function MaterialDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const materialId = Number(id);

    const { data: material, isLoading, error } = useMaterialDetail(materialId);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (error || !material) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">
                    <p className="text-red-500">Failed to load material details</p>
                    <Button onClick={() => navigate("/admin/materials")} className="mt-4">
                        Back to Materials
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
                    onClick={() => navigate("/admin/materials")}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Materials
                </Button>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {material.name}
                        </h1>
                        <div className="mt-2 flex items-center gap-3">
                            <StatusBadge status={material.status} />
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
                    <MaterialOverviewTab material={material} />
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
