"use client";

import { signOut } from "next-auth/react";

interface VerifyEmailPendingProps {
  email?: string | null;
}

export function VerifyEmailPending({ email }: VerifyEmailPendingProps) {
  return (
    <div className="auth-card animate-slide-up text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Verify your email</h1>
      <p className="text-gray-500 mb-8">
        We&apos;ve sent a verification email to <span className="font-semibold">{email || "your email"}</span>.
        Please check your inbox and click the link to continue.
      </p>

      <div className="space-y-4">
        <p className="text-sm text-gray-400 italic">
          Once verified, you will be able to access the dashboard.
        </p>
        
        <button 
          onClick={() => signOut({ callbackUrl: "/auth?mode=login" })} 
          className="text-brand-600 hover:underline text-sm font-medium"
        >
          Sign out and try another account
        </button>
      </div>
    </div>
  );
}
