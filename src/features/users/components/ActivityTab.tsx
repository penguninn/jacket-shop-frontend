import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { Chrome, Smartphone, Globe, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUserAuditLogs, useUserLoginHistory } from "@/features/users/hooks";
import { Alert, AlertDescription } from "@/shared/ui/alert";

interface Props {
  userId: number;
}

export function ActivityTab({ userId }: Props) {
  const { data: loginHistory, isLoading: loadingHistory, isError: historyError } = useUserLoginHistory(userId);
  const { data: auditLogs, isLoading: loadingLogs, isError: logsError } = useUserAuditLogs(userId);

  if (historyError || logsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load activity data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <LoadingSkeleton />
          ) : !loginHistory || loginHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No login history</p>
          ) : (
            <div className="space-y-3">
              {loginHistory.map((login) => (
                <div
                  key={login.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    {login.device.toLowerCase().includes("mobile") ? (
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Chrome className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{login.device}</p>
                      <p className="text-sm text-muted-foreground">
                        {login.ipAddress} · {login.location || "Unknown location"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(login.loginAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Actions</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingLogs ? (
            <LoadingSkeleton />
          ) : !auditLogs || auditLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent actions</p>
          ) : (
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.description}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(log.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
