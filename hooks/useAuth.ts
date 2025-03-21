// hooks/useAuth.ts

import { useAtom } from "jotai";
import { UserAtom, userAtom } from "@/state/atoms";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserProfile,
  loginUser,
  registerUser,
  logoutUser,
} from "@/utils/auth";
import {
  LoginRequestData,
  RegisterUserData,
  AuthResponse,
} from "@/types/auth.type";

/**
 * Custom Hook to handle authentication state.
 * - Uses `useMutation` for login & register.
 * - Uses `useQuery` for fetching user profile.
 */
export function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();
  const queryClient = useQueryClient(); // ✅ Use queryClient to update cache

  // Fetch user profile using `useQuery`
  const { data: userData, isLoading } = useQuery<UserAtom | null, Error>({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    retry: false, // Don't retry if authentication fails
  });

  // Ensure state is updated properly
  if (userData !== undefined && userData !== user) {
    setUser(userData);
  }

  // Login Mutation
  const loginMutation = useMutation<AuthResponse, Error, LoginRequestData>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token!); // ✅ Ensure token is stored
      setUser(data.user!);
      queryClient.setQueryData(["userProfile"], data.user); // ✅ Update cache
      router.push("/dashboard"); // Redirect after login
    },
  });

  // Register Mutation
  const registerMutation = useMutation<AuthResponse, Error, RegisterUserData>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token!);
      setUser(data.user!);
      queryClient.setQueryData(["userProfile"], data.user);
      router.push("/dashboard"); // Redirect after registration
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("token");
      setUser(null);
      queryClient.setQueryData(["userProfile"], null); // ✅ Reset cache
      router.push("/auth/login"); // Redirect after logout
    },
  });

  return {
    user: userData || user,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
  };
}
