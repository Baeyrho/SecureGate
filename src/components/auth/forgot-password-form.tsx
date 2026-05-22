"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/schemas/auth";

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const emailValue = watch("email");
  const isEmailValid = emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setSuccess(null);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        setSuccess("If an account exists, a reset link has been sent.");
        return;
      }

      const result = await response.json();
      setSuccess(result.success || "If an account exists, a reset link has been sent.");
    } catch (err) {
      setSuccess("If an account exists, a reset link has been sent.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card animate-slide-up">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot password?</h1>
      <p className="text-gray-500 mb-8">Enter your email and we&apos;ll send you a link to reset your password.</p>

      {success && (
        <div className="p-3 mb-6 bg-green-50 border border-green-100 text-green-600 rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="john@example.com"
            className="input-field"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={isLoading || !!success || !isEmailValid} className="btn-primary">
          {isLoading ? "Sending link..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        Remembered your password?{" "}
        <Link href="/auth?mode=login" className="text-brand-600 font-semibold hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
