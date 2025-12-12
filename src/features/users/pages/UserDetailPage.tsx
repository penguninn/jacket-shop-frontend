import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useUserDetail } from "../hooks";
import { Button } from "@/shared/ui/button";
import { UserStatusBadge } from "../components/UserStatusBadge";
import { UserRoleBadge } from "../components/UserRoleBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Skeleton } from "@/shared/ui/skeleton";
import { OverviewTab } from "../components/OverviewTab";
import { ActivityTab } from "../components/ActivityTab";
import { StatisticsTab } from "../components/StatisticsTab";
import type { User } from "../model/schemas";

// ============================================
// CONSTANTS
// ============================================
const ROUTES = {
  USERS_LIST: '/admin/users',
} as const;

const MESSAGES = {
  LOADING: 'Loading user details...',
  ERROR: 'Failed to load user details',
  BACK_TO_USERS: 'Back to Users',
} as const;

const TAB_CONFIG = [
  {
    id: 'overview',
    label: 'Overview',
    requiredRoles: [],
  },
  {
    id: 'activity',
    label: 'Activity',
    requiredRoles: [],
  },
  {
    id: 'statistics',
    label: 'Statistics',
    requiredRoles: ['ADMIN'],
  },
] as const;

type TabConfig = typeof TAB_CONFIG[number];
type TabId = TabConfig['id'];

function parseUserId(id: string | undefined): number | null {
  if (!id) return null;
  const parsed = Number(id);
  return isNaN(parsed) || parsed <= 0 ? null : parsed;
}

function hasAnyRole(
  userRoles: Array<{ id: number; name: string }>,
  requiredRoles: readonly string[]
): boolean {
  if (requiredRoles.length === 0) return true;
  return userRoles.some(role => requiredRoles.includes(role.name));
}

function getVisibleTabs(user: User): TabConfig[] {
  return TAB_CONFIG.filter(tab => hasAnyRole(user.roles, tab.requiredRoles));
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="mb-6 h-10 w-32" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-6 w-64" />
      </div>
      <Skeleton className="mt-6 h-12 w-full" />
      <Skeleton className="mt-4 h-96 w-full" />
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onBack: () => void;
}

function ErrorState({ message = MESSAGES.ERROR, onBack }: ErrorStateProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-800 font-medium">{message}</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {MESSAGES.BACK_TO_USERS}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface UserHeaderProps {
  user: User;
  onBack: () => void;
}

function UserHeader({ user, onBack }: UserHeaderProps) {
  return (
    <div className="mb-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {MESSAGES.BACK_TO_USERS}
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
                <UserRoleBadge key={role.id} role={role.name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UserTabsProps {
  userId: number;
  user: User;
  visibleTabs: TabConfig[];
  defaultTab?: TabId;
}

function UserTabs({ userId, user, visibleTabs, defaultTab = 'overview' }: UserTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="space-y-4">
      <TabsList>
        {visibleTabs.map((tab) => (
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

      {visibleTabs.some(t => t.id === 'statistics') && (
        <TabsContent value="statistics">
          <StatisticsTab userId={userId} />
        </TabsContent>
      )}
    </Tabs>
  );
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = useMemo(() => parseUserId(id), [id]);

  const { data: user, isLoading, isError } = useUserDetail(userId ?? 0, userId !== null);

  const visibleTabs = useMemo(() => {
    return user ? getVisibleTabs(user) : [];
  }, [user]);

  const handleBack = () => navigate(ROUTES.USERS_LIST);

  if (userId === null) {
    return <ErrorState message="Invalid user ID" onBack={handleBack} />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (isError || !user) {
    return <ErrorState onBack={handleBack} />;
  }

  return (
    <div className="container mx-auto py-8">
      <UserHeader user={user} onBack={handleBack} />
      <UserTabs
        userId={userId}
        user={user}
        visibleTabs={visibleTabs}
      />
    </div>
  );
}
