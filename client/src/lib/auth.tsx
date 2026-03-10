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
  activeChildProfileId: string | null;
  emailConsent: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isEarlyLearner: () => boolean;
  isPack12: () => boolean;
  isProgramme: () => boolean;
  hasPaidAccess: () => boolean;
  isFamilyTier: () => boolean;
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

  const isEarlyLearner = () => user?.subscriptionTier === "early_learner";
  const isPack12 = () => user?.subscriptionTier === "pack12" || user?.subscriptionTier === "pack12_family";
  const isProgramme = () => user?.subscriptionTier === "programme16" || user?.subscriptionTier === "programme16_family";
  const hasPaidAccess = () => {
    const t = user?.subscriptionTier;
    return t === "pack12" || t === "pack12_family" || t === "programme16" || t === "programme16_family" || t === "early_learner";
  };
  const isFamilyTier = () => user?.subscriptionTier?.includes("family") ?? false;

  const tierLabel = () => {
    if (!user) return "Free";
    switch (user.subscriptionTier) {
      case "early_learner": return "Early Learner";
      case "pack12": return "Practice Platform";
      case "pack12_family": return "Practice Platform (Family)";
      case "programme16": return "Young Scholar Programme";
      case "programme16_family": return "Young Scholar Programme (Family)";
      default: return "Free";
    }
  };

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, login, register, logout, isEarlyLearner, isPack12, isProgramme, hasPaidAccess, isFamilyTier, tierLabel }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
