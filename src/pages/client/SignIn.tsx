import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import type { Problem } from "@/lib/api/error";
import { useSignInMutation } from "@/hooks/auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signInSchema, type SignInForm } from "@/schema/signin";

function mapProblemToForm(err: Problem, setError: (name: any, e: any) => void) {
  if (err.errors) {
    for (const [field, msg] of Object.entries(err.errors)) {
      setError(field as any, { message: String(msg) });
    }
    return;
  }
  const msg = err.message || err.detail || "Login failed";
  setError("password", { message: msg });
}

export default function SignInForm() {
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    new URLSearchParams(location.search).get("redirectTo") || "/";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { username: "", password: "" },
  });

  const { mutate: doSignIn, isPending } = useSignInMutation();
  const busy = isSubmitting || isPending;
  
  return (
    <div className="min-h-[calc(100vh-400px)] flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <p className="text-sm text-gray-500 text-center">
            Sign in to your account to continue
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((v) =>
              doSignIn(
                { username: v.username, password: v.password },
                {
                  onSuccess: () => navigate(redirectTo, { replace: true }),
                  onError: (e: any) => mapProblemToForm(e, setError),
                },
              ),
            )}
            className="space-y-5"
          >
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  className="pl-9"
                  autoComplete="username"
                  {...register("username")}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  className="pl-9 pr-9"
                  autoComplete="current-password"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-sm underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="underline">
                Create one
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
