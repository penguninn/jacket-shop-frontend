import { useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Skeleton } from "@/shared/ui/skeleton";
import { useMe, useUpdateProfile } from "../hooks";
import { updateProfileSchema, type UpdateProfileInput } from "../model";
import type { User } from "@/features/users/model";

const PAGE_CONFIG = {
  TITLE: 'My Profile',
  SUBTITLE: 'Manage and protect your account',
  LABELS: {
    USERNAME: 'Username',
    FULL_NAME: 'Name',
    PHONE: 'Phone Number',
  },
  PLACEHOLDERS: {
    FULL_NAME: 'Your name',
  },
  BUTTONS: {
    SAVE: 'Save',
    CHANGE: 'Change',
  },
  MESSAGES: {
    LOADING: 'Loading profile...',
    ERROR: 'Failed to load profile',
    NOT_SET: 'Not set',
  },
} as const;

const ROUTES = {
  CHANGE_PHONE: '#',
} as const;

function createFormDefaults(profile?: User): UpdateProfileInput {
  return {
    fullName: profile?.fullName || '',
  };
}

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="border-b px-6 py-4">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

function FormRow({ children, className = '' }: FormRowProps) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-start gap-2 md:gap-0 ${className}`}
    >
      {children}
    </div>
  );
}

interface ReadOnlyFieldProps {
  label: string;
  value: string;
}

function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <FormRow>
      <Label className="w-full md:w-1/4 md:text-right md:pr-8 text-muted-foreground">
        {label}
      </Label>
      <div className="flex-1 text-sm font-medium">{value}</div>
    </FormRow>
  );
}

interface EditableFieldProps {
  label: string;
  value: string;
  linkText: string;
  linkTo: string;
}

function EditableField({ label, value, linkText, linkTo }: EditableFieldProps) {
  return (
    <FormRow>
      <Label className="w-full md:w-1/4 md:text-right md:pr-8 text-muted-foreground">
        {label}
      </Label>
      <div className="flex-1 flex items-center gap-4">
        <div className="text-sm font-medium">{value}</div>
        <Button
          variant="link"
          asChild
          className="p-0 h-auto text-sm text-primary underline-offset-4 hover:underline"
        >
          <Link to={linkTo}>{linkText}</Link>
        </Button>
      </div>
    </FormRow>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
      <div className="border-b px-6 py-4">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex-1 p-6 space-y-6">
        <Skeleton className="h-10 w-full max-w-3xl" />
        <Skeleton className="h-10 w-full max-w-3xl" />
        <Skeleton className="h-10 w-full max-w-3xl" />
      </div>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
}

function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-800 font-medium">{message}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { fullName: '' },
  });

  const { data: profile, isLoading, isError } = useMe();
  const { mutate: updateProfile, isPending } = useUpdateProfile({ setError: setError as any });


  const busy = isSubmitting || isPending;

  const formDefaults = useMemo(() => {
    return createFormDefaults(profile);
  }, [profile]);

  useEffect(() => {
    if (profile) {
      reset(formDefaults);
    }
  }, [profile, formDefaults, reset]);

  const onSubmit = useCallback(
    (data: UpdateProfileInput) => {
      updateProfile(data, {
        onSuccess: () => {
          reset(data);
        }
      });
    },
    [updateProfile, reset]
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError || !profile) {
    return <ErrorState message={PAGE_CONFIG.MESSAGES.ERROR} />;
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
      <PageHeader
        title={PAGE_CONFIG.TITLE}
        subtitle={PAGE_CONFIG.SUBTITLE}
      />

      <div className="flex-1 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
          {errors.root && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-6 mt-6">
            <ReadOnlyField
              label={PAGE_CONFIG.LABELS.USERNAME}
              value={profile.username}
            />

            <FormRow>
              <Label
                htmlFor="fullName"
                className="w-full md:w-1/4 md:text-right md:pr-8 text-muted-foreground pt-2"
              >
                {PAGE_CONFIG.LABELS.FULL_NAME}
              </Label>
              <div className="flex-1 space-y-2">
                <Input
                  id="fullName"
                  placeholder={PAGE_CONFIG.PLACEHOLDERS.FULL_NAME}
                  {...register('fullName')}
                  className="max-w-md"
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
            </FormRow>

            <EditableField
              label={PAGE_CONFIG.LABELS.PHONE}
              value={profile.phone || PAGE_CONFIG.MESSAGES.NOT_SET}
              linkText={PAGE_CONFIG.BUTTONS.CHANGE}
              linkTo={ROUTES.CHANGE_PHONE}
            />

            <FormRow>
              <div className="w-full md:w-1/4" />
              <div className="flex-1">
                <Button type="submit" disabled={busy || !isDirty}>
                  {PAGE_CONFIG.BUTTONS.SAVE}
                </Button>
              </div>
            </FormRow>
          </div>
        </form>
      </div>
    </div>
  );
}
