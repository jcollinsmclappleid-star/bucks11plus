import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Shield, ChevronUp, ChevronDown } from "lucide-react";

const TIERS = [
  { value: "free", label: "Free", color: "bg-slate-100 text-slate-700" },
  { value: "early_learner", label: "Early Learner · £49", color: "bg-amber-100 text-amber-800" },
  { value: "pack_monthly", label: "Bucks Practice Platform · £24.99/mo", color: "bg-blue-100 text-blue-800" },
  { value: "pack_plus", label: "Bucks Practice Platform Edge · £59.99/mo", color: "bg-indigo-100 text-indigo-800" },
  { value: "pack_annual", label: "Bucks Platform Edge Annual · £495/yr", color: "bg-indigo-200 text-indigo-900" },
  { value: "pack12", label: "Practice Platform (legacy · £119)", color: "bg-blue-50 text-blue-600" },
  { value: "programme8", label: "8 Week Programme · £59", color: "bg-emerald-100 text-emerald-800" },
  { value: "programme12", label: "12 Week Programme · £89", color: "bg-emerald-100 text-emerald-800" },
  { value: "programme24_plus", label: "Programme+ · £349", color: "bg-emerald-200 text-emerald-900" },
  { value: "programme16", label: "Young Scholar (legacy · £249)", color: "bg-emerald-50 text-emerald-600" },
  { value: "programme16_family", label: "Scholar Family (legacy · £349)", color: "bg-emerald-50 text-emerald-600" },
];

export default function AdminTierSwitcher() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  if (!user?.isAdmin) return null;

  const currentTier = TIERS.find(t => t.value === user.subscriptionTier) || TIERS[0];

  const switchTier = async (tier: string) => {
    setSwitching(true);
    try {
      await apiRequest("POST", "/api/admin/switch-tier", { tier });
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: `Switched to ${TIERS.find(t => t.value === tier)?.label || tier}` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed to switch", description: err.message });
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" data-testid="admin-tier-switcher">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden w-64">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          data-testid="button-toggle-admin-panel"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400" />
            <span>Admin: {currentTier.label.split(" ·")[0]}</span>
          </div>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>

        {open && (
          <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-2 pt-1 pb-1">Switch Tier to Test</p>
            {TIERS.map(tier => (
              <button
                key={tier.value}
                onClick={() => switchTier(tier.value)}
                disabled={switching || tier.value === user.subscriptionTier}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  tier.value === user.subscriptionTier
                    ? tier.color + " ring-2 ring-primary ring-offset-1"
                    : "hover:bg-slate-50 text-slate-600"
                } disabled:opacity-50`}
                data-testid={`button-switch-tier-${tier.value}`}
              >
                {tier.label}
                {tier.value === user.subscriptionTier && (
                  <span className="ml-2 text-[10px] uppercase font-bold">Active</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
