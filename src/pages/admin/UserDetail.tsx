import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserDetail } from "@/hooks/user";
import { UserStatusBadge } from "@/components/admin/tables/user/UserStatusBadge";
import { UserRoleBadge } from "@/components/admin/tables/user/UserRoleBadge";
import type { User } from "@/schema/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/admin/user/OverviewTab";
import { ActivityTab } from "@/components/admin/user/ActivityTab";
import { StatisticsTab } from "@/components/admin/user/StatisticsTab";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = Number(id);

  const { data: user, isLoading, error } = useUserDetail(userId);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-red-500">Failed to load user details</p>
          <Button onClick={() => navigate("/admin/users")} className="mt-4">
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const tabs = getVisibleTabs(user);

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/users")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {user.fullName}
              <span className="ml-3 text-xl text-muted-foreground">
                @{user.username}
              </span>
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <UserStatusBadge status={user.status} />
              <div className="flex gap-1">
                {user.roles.map((role) => (
                  <UserRoleBadge key={role} role={role} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab user={user} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityTab userId={userId} />
        </TabsContent>

        {tabs.find((t) => t.id === "statistics") && (
          <TabsContent value="statistics">
            <StatisticsTab userId={userId} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

// Helper: Get visible tabs based on user roles
function getVisibleTabs(user: User) {
  const allTabs = [
    { id: "overview", label: "Overview", roles: ["*"] },
    { id: "activity", label: "Activity", roles: ["*"] },
    { id: "statistics", label: "Statistics", roles: [ "ADMIN"] },
  ];

  return allTabs.filter(
    (tab) =>
      tab.roles.includes("*") ||
      user.roles.some((role) => tab.roles.includes(role))
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
