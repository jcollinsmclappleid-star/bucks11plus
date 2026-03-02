import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import { queryClient } from "./queryClient";

type User = {
  id: string;
  username: string;
  email: string | null;
  childName: string | null;
  childYear: string | null;
  practiceHours: string | null;
  difficultyAreas: string[] | null;
  subscriptionTier: string;
  subscriptionExpiresAt: string | null;
  stripeCustomerId: string | null;
  onboardingCompleted: boolean;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isPack12: () => boolean;
  isProgramme: () => boolean;
  hasPaidAccess: () => boolean;
  tierLabel: () => string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.status === 401) return null;
        if (!res.ok) return null;
        return res.json();
      } catch {
        return null;
      }
    },
    staleTime: Infinity,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      await apiRequest("POST", "/api/auth/login", { username, password });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      await apiRequest("POST", "/api/auth/register", { username, password });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const register = async (username: string, password: string) => {
    await registerMutation.mutateAsync({ username, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const isPack12 = () => user?.subscriptionTier === "pack12";
  const isProgramme = () => user?.subscriptionTier === "programme16";
  const hasPaidAccess = () => user?.subscriptionTier === "pack12" || user?.subscriptionTier === "programme16";

  const tierLabel = () => {
    if (!user) return "Free";
    switch (user.subscriptionTier) {
      case "pack12": return "Practice Pack";
      case "programme16": return "Structured Programme";
      default: return "Free";
    }
  };

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, login, register, logout, isPack12, isProgramme, hasPaidAccess, tierLabel }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
