"use client";

import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom, UserAtom } from "@/src/services/state/atoms";
import { useRouter } from "next/navigation";
import { fetchUserProfile } from "@/src/services/api/auth.api";
import { useQueryClient } from "@tanstack/react-query";

/**
 * HOC to wrap pages/components that require authentication.
 * If not authenticated, redirects to login.
 * Now with TypeScript, React best practices, and improved error handling.
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const [user, setUser] = useAtom(userAtom);
    const router = useRouter();
    const queryClient = useQueryClient();

    // Fetch and validate user on mount (only if no user in state)
    useEffect(() => {
      if (!user) {
        const fetchUser = async () => {
          const token = localStorage.getItem("token");
          if (!token) {
            router.replace("/auth/login");
            return;
          }

          try {
            // Optionally use QueryClient to check cache first
            const cached = queryClient.getQueryData<UserAtom>(["userProfile"]);
            if (cached) {
              setUser(cached);
              return;
            }
            const data = await fetchUserProfile();
            setUser(data);
            queryClient.setQueryData(["userProfile"], data);
          } catch (error) {
            console.error("Auth failed, redirecting to login", error);
            setUser(null);
            router.replace("/auth/login");
          }
        };
        fetchUser();
      }
    }, [user, setUser, router, queryClient]);

    // UX: Loading spinner
    if (!user) {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>Loading...</span>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  // Give better display name for React DevTools
  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthenticatedComponent;
}
