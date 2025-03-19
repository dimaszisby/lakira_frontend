// hooks/useAuth.ts
import { useAtom } from "jotai";
import { userAtom } from "@/state/atoms";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchUserProfile } from "@/utils/auth";

/**
 * Custom Hook to handle authentication and user state.
 * Redirects unauthenticated users to the login page.
 */
export function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        router.replace("/auth/login");
        return;
      }

      // Fetch user profile, now safely returns `null` on failure
      const userData = await fetchUserProfile();

      if (userData) {
        setUser(userData);
      } else {
        localStorage.removeItem("token");
        setUser(null); // ✅ Ensure it's null instead of undefined
        router.replace("/auth/login");
      }

      setLoading(false);
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user, setUser, router]);

  return { user, loading };
}
