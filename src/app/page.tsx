// app/page.tsx (Root page)
"use client";

import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation"; // ✅ Modern Next.js approach
import { userAtom } from "@/src/services/state/atoms";
import Link from "next/link";

export default function HomePage() {
  const user = useAtomValue(userAtom); // ✅ Use `useAtomValue` since we don't need to set state
  const router = useRouter();

  // ✅ Redirect to dashboard if user is logged in
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* ✅ App Branding */}
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Welcome to Lakira
      </h1>
      <p className="text-xl text-gray-700 text-center mb-8">
        Track and monitor your progress seamlessly. Set goals, view trends, and
        stay motivated!
      </p>

      {/* ✅ Conditional Rendering: Show login/register buttons only for non-authenticated users */}
      {!user ? (
        <div className="flex space-x-4">
          <Link
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition"
            aria-label="Login to your account"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="bg-green-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-green-700 transition"
            aria-label="Create a new account"
          >
            Register
          </Link>
        </div>
      ) : (
        <p className="mt-4 text-lg text-gray-700">
          Redirecting to your dashboard...
        </p>
      )}
    </div>
  );
}
