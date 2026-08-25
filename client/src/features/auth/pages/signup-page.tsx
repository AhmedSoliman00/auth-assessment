import { SignupForm } from '../components/signup-form';
import { useAuth } from '../hooks/use-auth';

export function SignupPage() {
  const { handleSignup, isLoading, error } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <SignupForm onSubmit={handleSignup} isLoading={isLoading} error={error} />
    </div>
  );
}
