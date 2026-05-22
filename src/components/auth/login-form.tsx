"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/auth";
import { PasswordInput } from "@/components/password-input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const isFormValid = loginSchema.safeParse({ email: emailValue, password: passwordValue }).success;
  const isEmailInvalid = passwordTouched && emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card animate-slide-up">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
      <p className="text-gray-500 mb-8">Login to your SecureGate account.</p>

      {error && (
        <div className="p-3 mb-6 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {searchParams.get("verified") && (
        <div className="p-3 mb-6 bg-green-50 border border-green-100 text-green-600 rounded-lg text-sm">
          Email verified! You can now log in.
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
          {passwordTouched && !emailValue && !errors.email && (
            <p className="text-red-500 text-xs mt-1">Email Can't Be Empty</p>
          )}
          {isEmailInvalid && (
            <p className="text-red-500 text-xs mt-1">Invalid Email Format</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Enter Password</label>
            <Link href="/auth?mode=forgot-password" title="Navigate to Forgot Password page" className="text-xs text-brand-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput register={register("password")} onFocus={() => setPasswordTouched(true)} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isLoading || !isFormValid} className="btn-primary">
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/auth?mode=signup" className="text-brand-600 font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
