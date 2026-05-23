import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="w-full max-w-4xl mx-auto text-center animate-fade-in min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center md:pt-14">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Secure{" "}
          <span className="text-brand-600">Authentication</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Authenticate Email, Password and Rate Limiting
        </p>
        <div className="flex justify-center">
          <Link href="/auth?mode=signup" className="btn-primary w-full md:!w-auto px-8 py-3.5 text-base">
            Get Started
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-gray-100">
        <div className="p-6">
          <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Email Verification</h3>
          <p className="text-gray-500">Verify user emails to ensure authentic signups and prevent spam accounts.</p>
        </div>
        <div className="p-6">
          <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Password Recovery</h3>
          <p className="text-gray-500">Secure password reset flow with expiring tokens sent via email.</p>
        </div>
        <div className="p-6">
          <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Rate Limiting</h3>
          <p className="text-gray-500">Built-in protection against brute force and abuse with Upstash Redis.</p>
        </div>
      </div>
    </div>
  );
}
