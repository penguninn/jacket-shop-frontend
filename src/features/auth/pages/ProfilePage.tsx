import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { updateProfileSchema } from "../model/schemas";
import type { UpdateProfileInput } from "../model/types";
import { useMe, useUpdateProfile } from "../hooks";
import type { Problem } from "@/shared/api/error";

function mapProblemToForm(err: Problem, setError: (name: any, e: any) => void) {
  if (err.errors) {
    for (const [field, msg] of Object.entries(err.errors)) {
      setError(field as any, { message: String(msg) });
    }
    return;
  }
  const msg = err.message || err.detail || "Update failed";
  setError("fullName", { message: msg });
}

export default function Profile() {
  const { data: profile, isLoading: isLoadingProfile } = useMe();
  const { mutate: doUpdateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { fullName: "" },
  });

  useEffect(() => {
    if (profile) {
      reset({ fullName: profile.fullName });
    }
  }, [profile, reset]);

  const busy = isSubmitting || isPending;

  const onSubmit = (values: UpdateProfileInput) => {
    doUpdateProfile(values, {
      onSuccess: () => {
        reset(values); // Reset dirty state
      },
      onError: (e: any) => {
        mapProblemToForm(e, setError);
      },
    });
  };

  if (isLoadingProfile) {
    return (
      <main className="col-span-12 md:col-span-10 md:row-start-2">
        <div className="flex h-full items-center justify-center">
          <p>Loading profile...</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="col-span-12 md:col-span-10 md:row-start-2">
        <div className="flex h-full items-center justify-center">
          <p>Failed to load profile</p>
        </div>
      </main>
    );
  }

  return (
    <main className="col-span-12 md:col-span-10 md:row-start-2">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="col-span-12 md:col-span-9 md:row-start-1">
          <div className="h-full border-b bg-card">
            <div className="px-4 py-5">
              <h2 className="text-lg font-semibold">My Profile</h2>
              <p className="text-sm text-muted-foreground">
                Manage and protect your account
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-1 grid grid-cols-12 gap-8 p-8">
            <div className="col-span-12 md:col-span-6">
              <div className="grid auto-rows-min gap-4">
                <Row>
                  <Label className="col-span-3 text-right text-gray-500">Username</Label>
                  <div className="col-span-9 text-sm">{profile.username}</div>
                </Row>

                <Row>
                  <Label htmlFor="fullName" className="col-span-3 text-right text-gray-500">
                    Name
                  </Label>
                  <div className="col-span-9 space-y-1">
                    <Input
                      id="fullName"
                      placeholder="Your name"
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                </Row>

                <Row>
                  <Label className="col-span-3 text-right text-gray-500">Phone Number</Label>
                  <div className="col-span-9 flex items-center gap-4">
                    <div className="text-sm">{profile.phone || "Not set"}</div>
                    <Link
                      to="#"
                      className="text-sm text-blue-500 underline"
                    >
                      Change
                    </Link>
                  </div>
                </Row>
              </div>

              {/* Save Button */}
              <div className="mt-8">
                <Button type="submit" disabled={busy || !isDirty}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

function Row({
  children,
  alignTop,
}: {
  children: React.ReactNode;
  alignTop?: boolean;
}) {
  return (
    <div
      className={`grid min-h-12 grid-cols-12 gap-3 ${alignTop ? "items-start" : "items-center"}`}
    >
      {children}
    </div>
  );
}
