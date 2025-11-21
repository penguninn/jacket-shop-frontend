import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import type { Problem } from "@/shared/api/error";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useSignUpMutation } from "../hooks/use-signup";
import { signUpSchema } from "../model/schemas";
import type { SignUpInput } from "../model/types";

function mapProblemToForm(err: Problem, setError: (name: any, e: any) => void) {
  if (err.errors) {
    for (const [field, msg] of Object.entries(err.errors)) {
      setError(field as any, { message: String(msg) });
    }
    return;
  }
  const msg = err.message || err.detail || "Register failed";
  setError("password", { message: msg });
}

export default function SignUpForm() {
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      fullName: "",
      phoneNumber: "",
      password: "",
    },
  });

  const { mutate: doSignUp, isPending } = useSignUpMutation();
  const busy = isSubmitting || isPending;

  return (
    <div className="min-h-[calc(100vh-400px)] flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <p className="text-sm text-gray-500 text-center">
            Sign up to start shopping with us
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((v) =>
              doSignUp(
                {
                  username: v.username,
                  fullName: v.fullName,
                  phoneNumber: v.phoneNumber,
                  password: v.password,
                },
                {
                  onSuccess: () => navigate("/signin", { replace: true }),
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

            {/* Fullname */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Fullname</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  className="pl-9"
                  autoComplete="name"
                  {...register("fullName")}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone number</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  type="text"
                  className="pl-9"
                  autoComplete="tel"
                  {...register("phoneNumber")}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-xs text-red-500">
                  {errors.phoneNumber.message}
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
                  autoComplete="new-password"
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

            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Signing up..." : "Sign up"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
