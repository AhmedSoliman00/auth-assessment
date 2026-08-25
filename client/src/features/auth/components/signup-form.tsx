import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { signupSchema, type SignupFormData } from '../schemas/signup.schema';
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

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void;
  isLoading: boolean;
  error: string | null;
}

export function SignupForm({ onSubmit, isLoading, error }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Sign up to get started with our platform
        </CardDescription>
      </CardHeader>

      {error && <Alert className="mb-6">{error}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField
          label="Full Name"
          htmlFor="name"
          error={errors.name?.message}
        >
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            error={Boolean(errors.name)}
            {...register('name')}
          />
        </FormField>

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
          hint={
            !errors.password
              ? 'Must be at least 8 characters with 1 letter, 1 number, and 1 special character.'
              : undefined
          }
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
          loadingText="Creating account..."
          fullWidth
          size="lg"
        >
          Sign Up
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link
          to="/signin"
          className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </Card>
  );
}
