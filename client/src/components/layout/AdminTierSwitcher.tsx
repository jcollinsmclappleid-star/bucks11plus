import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Shield, ChevronUp, ChevronDown } from "lucide-react";

const TIERS = [
  { value: "free", label: "Free", color: "bg-slate-100 text-slate-700" },
  { value: "pack_plus", label: "Bucks Plus Edge Monthly · £35/mo", color: "bg-indigo-100 text-indigo-800" },
  { value: "pack_annual", label: "Bucks Plus Edge Annual · £279/yr", color: "bg-indigo-200 text-indigo-900" },
  { value: "pack_monthly", label: "Legacy monthly (maps to Plus Edge)", color: "bg-blue-50 text-blue-600" },
  { value: "pack12", label: "Legacy pack12 (full access)", color: "bg-blue-50 text-blue-600" },
  { value: "pack12_family", label: "Legacy pack12 family", color: "bg-blue-50 text-blue-600" },
  { value: "early_learner", label: "Legacy early_learner", color: "bg-amber-50 text-amber-700" },
  { value: "programme8", label: "Legacy programme8", color: "bg-emerald-50 text-emerald-600" },
  { value: "programme12", label: "Legacy programme12", color: "bg-emerald-50 text-emerald-600" },
  { value: "programme16", label: "Legacy programme16", color: "bg-emerald-50 text-emerald-600" },
  { value: "programme16_family", label: "Legacy programme16 family", color: "bg-emerald-50 text-emerald-600" },
  { value: "programme24_plus", label: "Legacy programme24_plus", color: "bg-emerald-50 text-emerald-600" },
];

export default function AdminTierSwitcher() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  if (!user?.isAdmin) return null;

  const currentTier = TIERS.find(t => t.value === user.subscriptionTier) || { value: user.subscriptionTier, label: user.subscriptionTier, color: "bg-slate-100 text-slate-700" };

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
    <div className="fixed bottom-4 left-4 z-50" data-testid="admin-tier-switcher">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-lg hover:bg-slate-800 transition-colors"
        data-testid="button-admin-tier-toggle"
      >
        <Shield className="h-3.5 w-3.5" />
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${currentTier.color}`}>{currentTier.label}</span>
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-64 max-h-72 overflow-y-auto rounded-lg bg-white border border-slate-200 shadow-xl p-2 space-y-1">
          {TIERS.map((tier) => (
            <button
              key={tier.value}
              onClick={() => switchTier(tier.value)}
              disabled={switching || user.subscriptionTier === tier.value}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors disabled:opacity-50 ${tier.color} hover:opacity-80`}
              data-testid={`button-tier-${tier.value}`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
