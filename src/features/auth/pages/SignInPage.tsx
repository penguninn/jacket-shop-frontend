import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { useSignIn } from "../hooks";
import { signInSchema, type SignInInput } from "../model";


// ============================================
// CONSTANTS
// ============================================
const FORM_CONFIG = {
  TITLE: 'Welcome Back',
  SUBTITLE: 'Sign in to your account to continue',
  LABELS: {
    USERNAME: 'Username',
    PASSWORD: 'Password',
  },
  PLACEHOLDERS: {
    USERNAME: 'Enter your username',
    PASSWORD: 'Enter your password',
  },
  BUTTONS: {
    SUBMIT: 'Sign in',
    SUBMITTING: 'Signing in...',
    FORGOT_PASSWORD: 'Forgot password?',
    CREATE_ACCOUNT: 'Create one',
  },
  MESSAGES: {
    NO_ACCOUNT: "Don't have an account?",
  },
  ARIA_LABELS: {
    SHOW_PASSWORD: 'Show password',
    HIDE_PASSWORD: 'Hide password',
  },
} as const;

const ROUTES = {
  DEFAULT_REDIRECT: '/',
  FORGOT_PASSWORD: '/forgot-password',
  SIGN_UP: '/signup',
} as const;

const DEFAULT_VALUES: SignInInput = {
  username: '',
  password: '',
};

function getRedirectUrl(location: ReturnType<typeof useLocation>): string {
  const params = new URLSearchParams(location.search);
  return params.get('redirectTo') || ROUTES.DEFAULT_REDIRECT;
}

interface PasswordInputProps {
  id: string;
  label: string;
  register: any;
  error?: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
}

function PasswordInput({
  id,
  label,
  register,
  error,
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
          autoComplete="current-password"
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

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectUrl = getRedirectUrl(location);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { mutate: signIn, isPending } = useSignIn({ setError: setError as any });

  const busy = isSubmitting || isPending;

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    (data: SignInInput) => {
      signIn(data, {
        onSuccess: () => {
          navigate(redirectUrl, { replace: true });
        },
      });
    },
    [signIn, navigate, redirectUrl]
  );

  return (
    <div className="min-h-[calc(100vh-400px)] flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <FormHeader
          title={FORM_CONFIG.TITLE}
          subtitle={FORM_CONFIG.SUBTITLE}
        />

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">{FORM_CONFIG.LABELS.USERNAME}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  className="pl-9"
                  autoComplete="username"
                  placeholder={FORM_CONFIG.PLACEHOLDERS.USERNAME}
                  {...register('username')}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <PasswordInput
              id="password"
              label={FORM_CONFIG.LABELS.PASSWORD}
              register={register('password')}
              error={errors.password?.message}
              showPassword={showPassword}
              onToggleVisibility={handleTogglePassword}
            />

            <div className="flex items-center justify-between">
              <Button
                variant="link"
                asChild
                className="p-0 h-auto font-normal underline"
              >
                <Link to={ROUTES.FORGOT_PASSWORD}>
                  {FORM_CONFIG.BUTTONS.FORGOT_PASSWORD}
                </Link>
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={busy}>
              {busy
                ? FORM_CONFIG.BUTTONS.SUBMITTING
                : FORM_CONFIG.BUTTONS.SUBMIT}
            </Button>

            <FormFooter
              message={FORM_CONFIG.MESSAGES.NO_ACCOUNT}
              linkText={FORM_CONFIG.BUTTONS.CREATE_ACCOUNT}
              linkTo={ROUTES.SIGN_UP}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
