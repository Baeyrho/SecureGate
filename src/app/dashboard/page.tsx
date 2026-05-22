import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth?mode=login");
  }

  // Double check emailVerified even though middleware should handle it
  if (!session.user?.emailVerified) {
    redirect("/auth?mode=verify-pending");
  }

  return (
    <div className="w-full max-w-4xl px-2 md:px-8 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {session.user.name}</p>
        </div>
        <form action={async () => {
          "use server";
          await signOut({ redirectTo: "/auth?mode=login" });
        }} className="w-full md:w-auto">
          <button type="submit" className="w-full md:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
            Sign Out
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-brand-50 rounded-xl border border-brand-100">
          <h2 className="text-lg font-semibold text-brand-900 mb-2">Account Profile</h2>
          <div className="space-y-1 text-sm text-brand-800">
            <p><span className="font-medium">Name:</span> {session.user.name}</p>
            <p><span className="font-medium">Email:</span> {session.user.email}</p>
            <p><span className="font-medium">Status:</span> <span className="text-green-600 font-bold uppercase text-[10px] bg-green-100 px-1.5 py-0.5 rounded">Verified</span></p>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
          <p className="text-sm text-gray-400 italic">SecureGate Auth Layer Active</p>
        </div>
      </div>
    </div>
  );
}
