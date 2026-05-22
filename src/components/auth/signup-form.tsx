"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpInput } from "@/schemas/auth";
import { PasswordStrength } from "@/components/password-strength";
import { PasswordInput } from "@/components/password-input";

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const [emailTouched, setEmailTouched] = useState(false);

  const nameValue = watch("name");
  const passwordValue = watch("password");
  const emailValue = watch("email");
  const isFormValid = signUpSchema.safeParse({ name: nameValue, email: emailValue, password: passwordValue }).success;
  const isEmailInvalid = emailTouched && emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Server error — the database may not be connected yet. Check your DATABASE_URL and run `npx prisma migrate dev`.");
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to sign up");
      }

      setSuccess(result.success);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card animate-slide-up">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h1>
      <p className="text-gray-500 mb-8">Join SecureGate today.</p>

      {error && (
        <div className="p-3 mb-6 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 mb-6 bg-green-50 border border-green-100 text-green-600 rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter Full Name</label>
          <input
            {...register("name")}
            placeholder="John Doe"
            className="input-field"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="john@example.com"
            className="input-field"
            onBlur={() => setEmailTouched(true)}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          {isEmailInvalid && (
            <p className="text-red-500 text-xs mt-1">Invalid Email Format</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter Password</label>
          <PasswordInput register={register("password")} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          <PasswordStrength password={passwordValue} />
        </div>

        <button type="submit" disabled={isLoading || !isFormValid} className="btn-primary">
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/auth?mode=login" className="text-brand-600 font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
