import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

/**
 * NotFound page component shown for 404 errors.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center">
      <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full mb-6 animate-bounce">
        <AlertCircle size={48} />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
        404 - Page Not Found
      </h1>
      <p className="mt-4 text-base text-slate-500 dark:text-slate-400 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md transition-colors"
        >
          <Home size={18} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
