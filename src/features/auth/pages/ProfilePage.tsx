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


import { mapProblemToForm } from "@/shared/utils/form";
import { FormError } from "@/shared/ui/form-error";

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

  const onSubmit = (data: UpdateProfileInput) => {
    doUpdateProfile(data, {
      onSuccess: () => {
        reset();
      },
      onError: (e: any) => {
        mapProblemToForm(e, setError);
      },
    });
  };

  if (isLoadingProfile) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p>Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-medium">My Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and protect your account
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
          <FormError errors={errors} />

          <div className="space-y-6 mt-6">
            <Row>
              <Label className="w-full md:w-1/4 md:text-right md:pr-8 text-muted-foreground">
                Username
              </Label>
              <div className="flex-1 text-sm font-medium">{profile.username}</div>
            </Row>

            <Row>
              <Label
                htmlFor="fullName"
                className="w-full md:w-1/4 md:text-right md:pr-8 text-muted-foreground pt-2"
              >
                Name
              </Label>
              <div className="flex-1 space-y-2">
                <Input
                  id="fullName"
                  placeholder="Your name"
                  {...register("fullName")}
                  className="max-w-md"
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
            </Row>

            <Row>
              <Label className="w-full md:w-1/4 md:text-right md:pr-8 text-muted-foreground">
                Phone Number
              </Label>
              <div className="flex-1 flex items-center gap-4">
                <div className="text-sm font-medium">{profile.phone || "Not set"}</div>
                <Button variant="link" asChild className="p-0 h-auto text-sm text-primary underline-offset-4 hover:underline">
                  <Link to="#">Change</Link>
                </Button>
              </div>
            </Row>

            <Row>
              <div className="w-full md:w-1/4" /> {/* Spacer */}
              <div className="flex-1">
                <Button type="submit" disabled={busy || !isDirty}>
                  Save
                </Button>
              </div>
            </Row>
          </div>
        </form>
      </div >
    </div >
  );
}

function Row({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col md:flex-row md:items-start gap-2 md:gap-0 ${className}`}>
      {children}
    </div>
  );
}
