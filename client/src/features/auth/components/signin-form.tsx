import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { signinSchema, type SigninFormData } from '../schemas/signin.schema';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Alert,
  FormField,
  Input,
  PasswordInput,
  Button,
} from '../../../shared/components/ui';

interface SigninFormProps {
  onSubmit: (data: SigninFormData) => void;
  isLoading: boolean;
  error: string | null;
}

export function SigninForm({ onSubmit, isLoading, error }: SigninFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      {error && <Alert className="mb-6">{error}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField
          label="Email Address"
          htmlFor="email"
          error={errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            error={Boolean(errors.email)}
            {...register('email')}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            placeholder="••••••••"
            error={Boolean(errors.password)}
            {...register('password')}
          />
        </FormField>

        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Signing in..."
          fullWidth
          size="lg"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-400">
        Don&apos;t have an account?{' '}
        <Link
          to="/signup"
          className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors"
        >
          Sign up
        </Link>
      </div>
    </Card>
  );
}
