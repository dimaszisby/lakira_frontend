// components/layout/Header.tsx

"use client";

import Link from "next/link";
import { useAtom } from "jotai";
import { userAtom } from "../../state/atoms";
import { useRouter } from "next/router";

const Header = () => {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();

  const handleLogout = () => {
    // Implement logout logic
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <header className="bg-white text-gray-800 px-8 py-4 m-4 flex align-middle border border-b-2 border-gray-100 rounded-2xl">
      <nav className="flex w-full justify-between">
        {user ? (
          <>
            <Link href="/" className="text-pink-500 text-xl ext-xl font-bold">
              Lakira
            </Link>

            <div className="align-middle">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/metrics" className="mx-12">
                Metrics
              </Link>
              <Link href="/categories/">Categories</Link>
            </div>

            <div>
              <Link href="/account-settings" className="mr-12">
                Account
              </Link>
              <button onClick={handleLogout} className="text-red-500">
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/" className="text-pink-500 text-xl ext-xl font-bold">
              Lakira
            </Link>

            <div>
              <Link href="/auth/login" className="mr-12">
                Login
              </Link>
              <Link href="/auth/register">Register</Link>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
