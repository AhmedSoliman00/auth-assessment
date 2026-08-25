import { useState } from 'react';
import { useAuth } from '../../features/auth/hooks/use-auth';
import { authApi } from '../../features/auth/api/auth.api';
import { Button, Badge, Alert } from '../../shared/components/ui';
import { getErrorMessage } from '../../shared/lib/get-error-message';
import type { User } from '../../features/auth/types/auth.types';

export function DashboardPage() {
  const { user, handleLogout, isLoading } = useAuth();

  const [isTestingApi, setIsTestingApi] = useState(false);
  const [testResult, setTestResult] = useState<User | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [testTime, setTestTime] = useState<string | null>(null);

  const handleTestProtectedApi = async () => {
    setIsTestingApi(true);
    setTestError(null);
    setTestResult(null);

    const start = performance.now();
    try {
      const data = await authApi.getMe();
      const duration = Math.round(performance.now() - start);
      setTestResult(data);
      setTestTime(`${duration}ms`);
    } catch (err) {
      setTestError(getErrorMessage(err));
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              EA
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
              Easygenerator Auth
            </span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            isLoading={isLoading}
            className="hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col gap-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-slate-900/80 border border-indigo-500/20 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <Badge variant="indigo" className="uppercase tracking-wider mb-4">
              Protected Area
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              Welcome, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-slate-300 leading-relaxed">
              You have successfully authenticated via JWT access tokens and
              secure refresh token rotation.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Protected Route Tester Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Protected API Tester
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Triggers{' '}
                <code className="text-indigo-300 bg-slate-950 px-1.5 py-0.5 rounded">
                  GET /auth/me
                </code>{' '}
                using the in-memory access token via Axios interceptor.
              </p>
            </div>

            <Button
              onClick={handleTestProtectedApi}
              isLoading={isTestingApi}
              loadingText="Fetching..."
              size="sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Test GET /auth/me</span>
            </Button>
          </div>

          {testError && <Alert className="mt-4">{testError}</Alert>}

          {testResult && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  200 OK — Header Authorization: Bearer &lt;accessToken&gt;
                </span>
                {testTime && <span className="text-slate-500">{testTime}</span>}
              </div>
              <pre className="text-indigo-200 overflow-x-auto leading-relaxed">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* User Info & Security Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              User Profile
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">
                  User ID
                </span>
                <p className="font-mono text-sm text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                  {user?._id}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">
                  Full Name
                </span>
                <p className="text-sm font-medium text-slate-200 mt-0.5">
                  {user?.name}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">
                  Email Address
                </span>
                <p className="text-sm font-medium text-slate-200 mt-0.5">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Security Overview
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Access Token</span>
                <Badge variant="emerald">In-Memory (Active)</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Refresh Token</span>
                <Badge variant="indigo">HttpOnly Cookie (Rotated)</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Single-Flight Refresh</span>
                <Badge variant="violet">Enabled</Badge>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
