import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, User, Phone, AlertCircle } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { useSignUp } from "../hooks";
import { signUpSchema, type SignUpInput } from "../model";

const FORM_CONFIG = {
  TITLE: 'Create Account',
  SUBTITLE: 'Sign up to start shopping with us',
  LABELS: {
    USERNAME: 'Username',
    FULL_NAME: 'Full Name',
    PHONE: 'Phone Number',
    PASSWORD: 'Password',
  },
  PLACEHOLDERS: {
    USERNAME: 'Enter your username',
    FULL_NAME: 'Enter your full name',
    PHONE: 'Enter your phone number',
    PASSWORD: 'Create a password',
  },
  BUTTONS: {
    SUBMIT: 'Sign up',
    SUBMITTING: 'Signing up...',
    SIGN_IN: 'Sign in',
  },
  MESSAGES: {
    HAVE_ACCOUNT: 'Already have an account?',
  },
  ARIA_LABELS: {
    SHOW_PASSWORD: 'Show password',
    HIDE_PASSWORD: 'Hide password',
  },
} as const;

const ROUTES = {
  SIGN_IN: '/signin',
} as const;

const DEFAULT_VALUES: SignUpInput = {
  username: '',
  fullName: '',
  phoneNumber: '',
  password: '',
};

interface FormHeaderProps {
  title: string;
  subtitle: string;
}

function FormHeader({ title, subtitle }: FormHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="text-2xl text-center">{title}</CardTitle>
      <p className="text-sm text-gray-500 text-center">{subtitle}</p>
    </CardHeader>
  );
}

interface FormFooterProps {
  message: string;
  linkText: string;
  linkTo: string;
}

function FormFooter({ message, linkText, linkTo }: FormFooterProps) {
  return (
    <div className="text-center text-sm text-muted-foreground">
      {message}{' '}
      <Button
        variant="link"
        asChild
        className="p-0 h-auto font-normal underline"
      >
        <Link to={linkTo}>{linkText}</Link>
      </Button>
    </div>
  );
}

interface IconInputProps {
  id: string;
  label: string;
  type?: string;
  icon: React.ComponentType<{ className?: string }>;
  register: any;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
}

function IconInput({
  id,
  label,
  type = 'text',
  icon: Icon,
  register,
  error,
  placeholder,
  autoComplete,
}: IconInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          type={type}
          className="pl-9"
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...register}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface PasswordInputProps {
  id: string;
  label: string;
  register: any;
  error?: string;
  placeholder?: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
}

function PasswordInput({
  id,
  label,
  register,
  error,
  placeholder,
  showPassword,
  onToggleVisibility,
}: PasswordInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className="pl-9 pr-9"
          placeholder={placeholder}
          autoComplete="new-password"
          {...register}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onToggleVisibility}
          aria-label={
            showPassword
              ? FORM_CONFIG.ARIA_LABELS.HIDE_PASSWORD
              : FORM_CONFIG.ARIA_LABELS.SHOW_PASSWORD
          }
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { mutate: signUp, isPending } = useSignUp({ setError: setError as any });

  const busy = isSubmitting || isPending;

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    (data: SignUpInput) => {
      signUp(data, {
        onSuccess: () => {
          navigate(ROUTES.SIGN_IN);
        },
      });
    },
    [signUp, navigate]
  );

  return (
    <div className="min-h-[calc(100vh-400px)] flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <FormHeader
          title={FORM_CONFIG.TITLE}
          subtitle={FORM_CONFIG.SUBTITLE}
        />

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <IconInput
              id="username"
              label={FORM_CONFIG.LABELS.USERNAME}
              icon={User}
              register={register('username')}
              error={errors.username?.message}
              placeholder={FORM_CONFIG.PLACEHOLDERS.USERNAME}
              autoComplete="username"
            />

            <IconInput
              id="fullName"
              label={FORM_CONFIG.LABELS.FULL_NAME}
              icon={User}
              register={register('fullName')}
              error={errors.fullName?.message}
              placeholder={FORM_CONFIG.PLACEHOLDERS.FULL_NAME}
              autoComplete="name"
            />

            <IconInput
              id="phoneNumber"
              label={FORM_CONFIG.LABELS.PHONE}
              type="tel"
              icon={Phone}
              register={register('phoneNumber')}
              error={errors.phoneNumber?.message}
              placeholder={FORM_CONFIG.PLACEHOLDERS.PHONE}
              autoComplete="tel"
            />

            <PasswordInput
              id="password"
              label={FORM_CONFIG.LABELS.PASSWORD}
              register={register('password')}
              error={errors.password?.message}
              placeholder={FORM_CONFIG.PLACEHOLDERS.PASSWORD}
              showPassword={showPassword}
              onToggleVisibility={handleTogglePassword}
            />

            <Button type="submit" className="w-full" disabled={busy}>
              {busy
                ? FORM_CONFIG.BUTTONS.SUBMITTING
                : FORM_CONFIG.BUTTONS.SUBMIT}
            </Button>

            <FormFooter
              message={FORM_CONFIG.MESSAGES.HAVE_ACCOUNT}
              linkText={FORM_CONFIG.BUTTONS.SIGN_IN}
              linkTo={ROUTES.SIGN_IN}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


