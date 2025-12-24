import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { useUserStatistics } from "@/features/users/hooks";
import { DollarSign, Package, Clock, Star, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { formatCurrency } from "@/shared/utils/format";

interface Props {
  userId: number;
}

export function StatisticsTab({ userId }: Props) {
  const { data: stats, isLoading, isError } = useUserStatistics(userId, true);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load user statistics. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!stats) {
    return <p className="text-muted-foreground">No statistics available</p>;
  }

  const metrics = [
    {
      title: "Orders Handled",
      value: stats.ordersCount,
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Revenue Generated",
      value: formatCurrency(stats.revenue),
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Avg Handling Time",
      value: `${stats.avgHandlingTime.toFixed(1)} min`,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Customer Rating",
      value: stats.customerRating ? `${stats.customerRating}/5` : "N/A",
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Charts and detailed analytics coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}
