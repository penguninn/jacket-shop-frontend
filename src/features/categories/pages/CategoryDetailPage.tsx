import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCategoryDetail } from "../hooks";
import { Button } from "@/shared/ui/button";
import { CategoryStatusBadge } from "../components/CategoryStatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Skeleton } from "@/shared/ui/skeleton";
import { OverviewTab } from "../components/OverviewTab";

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const categoryId = Number(id);

  const { data: category, isLoading, error } = useCategoryDetail(categoryId);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !category) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-red-500">Failed to load category details</p>
          <Button onClick={() => navigate("/admin/categories")} className="mt-4">
            Back to Categories
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
          onClick={() => navigate("/admin/categories")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {category.name}
              <span className="ml-3 text-xl text-muted-foreground">
                #{category.id}
              </span>
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <CategoryStatusBadge status={category.status} />
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
          <OverviewTab category={category} />
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
