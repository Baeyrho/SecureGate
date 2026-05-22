import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { ResetPasswordForm } from "./reset-password-form";
import { VerifyEmailForm } from "./verify-email-form";
import { VerifyEmailPending } from "./verify-email-pending";
import type { ReactNode } from "react";

interface AuthModeConfig {
  render: (props?: any) => ReactNode;
}

const authModes: Record<string, AuthModeConfig> = {
  login: { render: () => <LoginForm /> },
  signup: { render: () => <SignupForm /> },
  "forgot-password": { render: () => <ForgotPasswordForm /> },
  "reset-password": { render: (props) => <ResetPasswordForm token={props?.token} /> },
  "verify-email": { render: (props) => <VerifyEmailForm token={props?.token} /> },
  "verify-pending": { render: (props) => <VerifyEmailPending email={props?.email} /> },
};

export function getAuthModeConfig(mode: string): AuthModeConfig | undefined {
  return authModes[mode];
}

export function getAllAuthModes(): string[] {
  return Object.keys(authModes);
}
