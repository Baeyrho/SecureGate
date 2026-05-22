"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordInput } from "@/schemas/auth";
import { PasswordStrength } from "@/components/password-strength";
import { PasswordInput } from "@/components/password-input";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          token: token,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to reset password");
      }

      router.push("/auth?mode=login&reset=success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card animate-slide-up">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h1>
      <p className="text-gray-500 mb-8">Enter a new password for your account.</p>

      {error && (
        <div className="p-3 mb-6 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter Password</label>
          <PasswordInput register={register("password")} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          <PasswordStrength password={passwordValue} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <PasswordInput register={register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
