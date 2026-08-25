export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute w-10 h-10 border-4 border-violet-500/20 border-b-violet-500 rounded-full animate-spin [animation-direction:reverse]"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400 tracking-wide animate-pulse">
        Authenticating...
      </p>
    </div>
  );
}
