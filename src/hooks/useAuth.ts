// TODO: refactor to Auth

import { useAtom } from "jotai";
import { UserAtom, userAtom } from "@/src/services/state/atoms";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  fetchUserProfile,
  loginUser,
  registerUser,
  logoutUser,
} from "@/src/services/api/auth.api";
import {
  AuthResponseDTO,
  CreateUserRequestDTO,
  LoginRequestDTO,
} from "@/types/dtos/user.dto";

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

  // Update state in a useEffect to avoid state updates during render
  useEffect(() => {
    if (userData !== undefined && userData !== user) {
      setUser(userData);
    }
  }, [userData, user, setUser]);

  // Login Mutation
  const loginMutation = useMutation<AuthResponseDTO, Error, LoginRequestDTO>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token!); // ✅ Ensure token is stored
      setUser(data.user!);
      queryClient.setQueryData(["userProfile"], data.user); // ✅ Update cache
      router.push("/dashboard"); // Redirect after login
    },
  });

  // Register Mutation
  const registerMutation = useMutation<
    AuthResponseDTO,
    Error,
    CreateUserRequestDTO
  >({
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
