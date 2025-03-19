// pages/index.tsx

import Link from "next/link";
import { useAtom } from "jotai";
import { userAtom } from "@/state/atoms";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";

export default function Home() {
  const [user] = useAtom(userAtom);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-5xl font-bold mb-6">Welcome to Lakira</h1>
        <p className="text-xl mb-8 text-center">
          Track and monitor your progress seamlessly. Set goals, view trends,
          and stay motivated!
        </p>
        {!user ? (
          <div className="flex space-x-4">
            <Link
              href="/auth/login"
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
            >
              Register
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-lg">Redirecting to your dashboard...</p>
        )}
      </div>
    </Layout>
  );
}
