"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

interface VerifyEmailFormProps {
  token: string;
}

export function VerifyEmailForm({ token }: VerifyEmailFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">("idle");

  const verifyToken = useCallback(async () => {
    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(result.success);

        const stored = localStorage.getItem("pendingVerification");
        if (stored) {
          const { email, password } = JSON.parse(stored);
          const signInResult = await signIn("credentials", { email, password, redirect: false });
          if (!signInResult?.error) {
            localStorage.removeItem("pendingVerification");
            setTimeout(() => router.push("/dashboard"), 2000);
            return;
          }
        }

        setTimeout(() => router.push("/auth?mode=login"), 3000);
      } else {
        setStatus("error");
        setMessage(result.error);
      }
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong");
    }
  }, [token, router]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;

    setResendStatus("sending");

    try {
      await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      setResendStatus("sent");
    } catch {
      setResendStatus("sent");
    }
  };

  return (
    <div className="auth-card animate-slide-up text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Verification</h1>
      
      <div className={`p-4 rounded-lg text-sm mb-6 ${
        status === 'loading' ? 'bg-blue-50 text-blue-700' :
        status === 'success' ? 'bg-green-50 text-green-700' :
        'bg-red-50 text-red-700'
      }`}>
        {message}
      </div>

      {status === "success" && (
        <p className="text-gray-500">Redirecting you to dashboard...</p>
      )}

      {status === "error" && (
        <div>
          <p className="text-gray-500 mb-4">The link might be expired or invalid.</p>
          
          {resendStatus === "sent" ? (
            <p className="text-sm text-green-600 mb-4">Verification email resent! Check your inbox.</p>
          ) : (
            <form onSubmit={handleResend} className="text-left space-y-3 mb-4">
              <label className="block text-sm font-medium text-gray-700">Resend verification email</label>
              <input
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-field"
                required
              />
              <button
                type="submit"
                disabled={resendStatus === "sending"}
                className="btn-primary"
              >
                {resendStatus === "sending" ? "Sending..." : "Resend Verification"}
              </button>
            </form>
          )}

          <Link href="/auth?mode=signup" className="text-brand-600 hover:underline text-sm font-medium">
            Back to Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
