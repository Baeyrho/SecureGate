import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getAuthModeConfig } from "@/components/auth/auth-modes";

interface AuthPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const mode = (searchParams.mode as string) || "login";
  const token = searchParams.token as string;
  const session = await auth();

  const config = getAuthModeConfig(mode);
  const props = mode === "reset-password" || mode === "verify-email"
    ? { token }
    : mode === "verify-pending"
    ? { email: session?.user?.email }
    : undefined;

  return (
    <div className="w-full flex flex-col items-center md:justify-center gap-2 md:gap-5">
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        {config ? config.render(props) : <div className="text-gray-500">Unknown mode</div>}
      </Suspense>

      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors group">
        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}
