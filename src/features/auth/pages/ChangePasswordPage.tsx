import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export default function ChangePasswordPage() {
    return (
        <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
            <div className="border-b px-6 py-4">
                <h2 className="text-lg font-medium">Change Password</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Update your password to keep your account secure
                </p>
            </div>
            <div className="flex-1 p-6">
                <form className="max-w-md space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                    </div>
                    <Button type="submit">
                        Update Password
                    </Button>
                </form>
            </div>
        </div>
    );
}
