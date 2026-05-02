import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import { queryClient } from "./queryClient";

type User = {
  id: string;
  username: string;
  email: string | null;
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
  emailVerified: boolean;
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
  isFullPlatform: () => boolean;
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

  const PACK_TIERS = new Set(["pack12", "pack12_family", "pack_monthly", "pack_plus", "pack_annual"]);
  const PROGRAMME_TIERS = new Set(["programme16", "programme16_family", "programme8", "programme12", "programme24_plus"]);
  const FULL_PLATFORM_TIERS = new Set(["pack_plus", "pack_annual", "programme16", "programme16_family", "programme8", "programme12", "programme24_plus"]);

  const isEarlyLearner = () => user?.subscriptionTier === "early_learner";
  const isPack12 = () => !!user?.isAdmin || PACK_TIERS.has(user?.subscriptionTier ?? "") || PROGRAMME_TIERS.has(user?.subscriptionTier ?? "");
  const isProgramme = () => !!user?.isAdmin || PROGRAMME_TIERS.has(user?.subscriptionTier ?? "");
  const isFullPlatform = () => !!user?.isAdmin || FULL_PLATFORM_TIERS.has(user?.subscriptionTier ?? "");
  const hasPaidAccess = () => {
    if (user?.isAdmin) return true;
    const t = user?.subscriptionTier ?? "";
    return t === "early_learner" || PACK_TIERS.has(t) || PROGRAMME_TIERS.has(t);
  };
  const isFamilyTier = () => user?.subscriptionTier?.includes("family") ?? false;

  const tierLabel = () => {
    if (!user) return "Free";
    switch (user.subscriptionTier) {
      // Active plans
      case "pack_plus": return "Bucks Plus Edge";
      case "pack_annual": return "Bucks Plus Edge — Annual";
      // Legacy plans — all display as Bucks Plus Edge
      case "early_learner":
      case "pack12":
      case "pack12_family":
      case "pack_monthly":
      case "programme8":
      case "programme12":
      case "programme16":
      case "programme16_family":
      case "programme24_plus": return "Bucks Plus Edge";
      default: return "Free";
    }
  };

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, login, register, logout, isEarlyLearner, isPack12, isProgramme, isFullPlatform, hasPaidAccess, isFamilyTier, tierLabel }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
