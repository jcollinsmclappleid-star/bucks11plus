import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, User, Users, Calendar, Mail, ExternalLink, ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, Download } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { Link, useLocation } from "wouter";
import { useAuth } from "../lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getChildName, setChildName, removeChildName, getLegacyChildName, setLegacyChildName, useChildNamesVersion } from "../lib/childNames";

type Tab = "profile" | "subscription";

const UPGRADE_OPTIONS: Record<string, { tier: string; label: string; price: string; description: string }[]> = {
  // Active monthly subscribers can switch to annual to save £71
  pack_plus: [
    { tier: "pack_annual", label: "Bucks Plus Edge — Annual", price: "£279/yr", description: "Lock in 12 months of full access — save £141 vs staying on monthly." },
  ],
  // All other tiers have no upgrade path on new model
  pack_annual: [],
  pack_monthly: [],
  pack12: [],
  pack12_family: [],
  programme8: [],
  programme12: [],
  programme16: [],
  programme16_family: [],
  programme24_plus: [],
  early_learner: [],
};

export default function Account() {
  const { user, tierLabel, hasPaidAccess, isFamilyTier, isProgramme } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editYear, setEditYear] = useState("");
  const [addingChild, setAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildYear, setNewChildYear] = useState("Year 5");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState<"retention" | "confirm">("retention");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteStripeError, setDeleteStripeError] = useState(false);
  const [examDate, setExamDate] = useState("");
  const [editingLegacyName, setEditingLegacyName] = useState(false);
  const [legacyNameDraft, setLegacyNameDraft] = useState("");
  // Subscribe to localStorage child-name changes so this view re-renders
  // whenever any tab updates a name. The helper functions also notify
  // synchronously, so same-tab edits flush immediately.
  useChildNamesVersion();
  const refreshNames = () => {};
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelResult, setCancelResult] = useState<{ cancelledImmediately: boolean; accessUntil?: string } | null>(null);

  const { data: profiles = [] } = useQuery<any[]>({
    queryKey: ["/api/child-profiles"],
    enabled: !!user,
  });

  const { data: testDayConfig } = useQuery({
    queryKey: ["/api/test-day-config"],
    enabled: !!user,
  });

  const addChildMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/child-profiles", {
        childYear: newChildYear,
      });
      const profile = await res.json();
      // Save the child's first name on this device only — never sent to the server.
      if (profile?.id && newChildName.trim()) {
        setChildName(profile.id, newChildName.trim());
      }
      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/child-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setAddingChild(false);
      setNewChildName("");
      toast({ title: "Child profile added" });
    },
  });

  const updateChildMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PUT", `/api/child-profiles/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/child-profiles"] });
      setEditingProfile(null);
      toast({ title: "Profile updated" });
    },
  });

  const deleteChildMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/child-profiles/${id}`);
      removeChildName(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/child-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Profile removed" });
    },
  });

  const saveExamDateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PUT", "/api/test-day-config", { examDate });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/test-day-config"] });
      toast({ title: "Exam date saved" });
    },
  });

  const emailConsentMutation = useMutation({
    mutationFn: async (consent: boolean) => {
      const res = await apiRequest("PUT", "/api/user/email-consent", { consent });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Email preferences updated" });
    },
  });

  const manageBillingMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/stripe/customer-portal", {});
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
    onError: () => {
      toast({ title: "Could not open billing portal", description: "Please try again or contact support.", variant: "destructive" });
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/stripe/cancel-subscription", {});
      return res.json();
    },
    onSuccess: (data) => {
      setCancelResult({ cancelledImmediately: data.cancelledImmediately, accessUntil: data.accessUntil });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: () => {
      toast({ title: "Could not cancel subscription", description: "Please try again or contact support.", variant: "destructive" });
      setShowCancelModal(false);
    },
  });

  const dataExportMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/user/export", { credentials: "include" });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const cd = res.headers.get("content-disposition") || "";
      const match = /filename="?([^";]+)"?/i.exec(cd);
      const filename = match?.[1] || `bucks11plus-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({ title: "Download started", description: "Your data export is downloading." });
    },
    onError: () => {
      toast({ title: "Could not download your data", description: "Please try again or contact support.", variant: "destructive" });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/user", { method: "DELETE", credentials: "include" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw { code: data.code, message: data.message };
      }
    },
    onSuccess: () => {
      setLocation("/account-deleted");
    },
    onError: (err: any) => {
      if (err?.code === "stripe_cancel_failed") {
        setDeleteStripeError(true);
      } else {
        toast({ title: "Could not delete account", description: "Please try again or contact support.", variant: "destructive" });
      }
    },
  });

  const handleUpgrade = async (targetTier: string) => {
    setCheckoutLoading(targetTier);
    try {
      const res = await apiRequest("POST", "/api/checkout/upgrade", { targetTier });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      toast({ title: "Could not start upgrade", description: "Please try again.", variant: "destructive" });
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (!user) return null;

  const currentTier = user.subscriptionTier || "free";
  const upgradeOptions = UPGRADE_OPTIONS[currentTier] || [];
  // All paid tiers are equivalent; only pack_plus can upgrade to annual
  const isTopTier = currentTier !== "free" && currentTier !== "pack_plus";
  const hasStripeAccount = !!user.stripeCustomerId;

  const tierDescriptions: Record<string, string> = {
    free: "Limited to free readiness check and basic results.",
    // Active plans
    pack_plus: "Bucks Plus Edge — full access billed monthly. Cancel any time. Includes all 2,500+ questions, every drill, mock exams, readiness checks, PDF reports and premium analytics.",
    pack_annual: "Bucks Plus Edge — Annual. 12 months of full access in one payment. Includes all 2,500+ questions, every drill, mock exams, readiness checks, PDF reports and premium analytics.",
    // Legacy plans — all mapped to full access
    early_learner: "Bucks Plus Edge (legacy plan) — full platform access.",
    pack12: "Bucks Plus Edge (legacy plan) — full platform access.",
    pack12_family: "Bucks Plus Edge (legacy plan) — full platform access for your family.",
    pack_monthly: "Bucks Plus Edge (legacy plan) — full platform access billed monthly.",
    programme8: "Bucks Plus Edge (legacy plan) — full platform access.",
    programme12: "Bucks Plus Edge (legacy plan) — full platform access.",
    programme16: "Bucks Plus Edge (legacy plan) — full platform access.",
    programme16_family: "Bucks Plus Edge (legacy plan) — full platform access for your family.",
    programme24_plus: "Bucks Plus Edge (legacy plan) — full platform access.",
  };

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile Details", icon: <User className="h-4 w-4" /> },
    { id: "subscription", label: "Subscription", icon: <CreditCard className="h-4 w-4" /> },
  ];

  return (
    <>
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      <Seo title="Account | Bucks 11 Plus Tests" description="Manage your account settings and subscription." />

      <div className="border-b border-border/60 pb-6">
        <h1 className="text-3xl font-bold text-primary font-serif">Account Settings</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`justify-start gap-2 w-full ${activeTab === item.id ? "text-primary font-medium" : "text-muted-foreground"}`}
              onClick={() => setActiveTab(item.id)}
              data-testid={`tab-${item.id}`}
            >
              {item.icon} {item.label}
            </Button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-6">

          {activeTab === "subscription" && (
            <>
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Manage your access to Bucks 11 Plus Tests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className="font-bold text-primary text-lg" data-testid="text-tier-name">{tierLabel()}</span>
                          {user.subscriptionExpiresAt
                          ? <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">Cancellation scheduled</Badge>
                          : <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                        }
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tierDescriptions[currentTier] || "Limited access."}
                        </p>
                        {user.subscriptionExpiresAt ? (
                          <p className="text-xs text-amber-700 font-medium mt-1">
                            Full access until {new Date(user.subscriptionExpiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} — no further payments will be taken.
                          </p>
                        ) : currentTier === "pack_monthly" ? (
                          <p className="text-xs text-muted-foreground mt-1">Renews monthly. Cancel any time before your next billing date.</p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {hasPaidAccess() && (
                    <div className="space-y-3 pt-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Billing</p>
                      {hasStripeAccount && (
                        <Button
                          variant="outline"
                          className="w-full justify-between h-12"
                          onClick={() => manageBillingMutation.mutate()}
                          disabled={manageBillingMutation.isPending}
                          data-testid="button-manage-billing"
                        >
                          <span className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <span>Manage billing & payment method</span>
                          </span>
                          {manageBillingMutation.isPending && (
                            <span className="text-xs text-muted-foreground">Opening…</span>
                          )}
                        </Button>
                      )}

                      <div className="pt-1 space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-between h-12 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                          onClick={() => { setCancelResult(null); setShowCancelModal(true); }}
                          data-testid="button-cancel-subscription"
                        >
                          <span className="flex items-center gap-2">
                            <span>Cancel subscription</span>
                          </span>
                        </Button>
                        <p className="text-xs text-muted-foreground px-1">
                          You will keep full access until the end of your current billing period. No future payments will be taken.
                        </p>
                      </div>
                    </div>
                  )}

                  {!hasPaidAccess() && (
                    <div className="pt-2">
                      <Button className="w-full" asChild data-testid="button-upgrade-account">
                        <Link href="/pricing">View Plans <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {hasPaidAccess() && !isTopTier && upgradeOptions.length > 0 && (
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <CardTitle>Upgrade Options</CardTitle>
                    </div>
                    <CardDescription>Add structured coaching or move to a full programme.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upgradeOptions.map((opt) => (
                      <div
                        key={opt.tier}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/60 gap-3"
                        data-testid={`upgrade-option-${opt.tier}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="font-semibold text-primary text-sm">{opt.label}</span>
                            <span className="font-bold text-primary">{opt.price}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{opt.description}</p>
                        </div>
                        <Button
                          size="sm"
                          className="shrink-0"
                          onClick={() => handleUpgrade(opt.tier)}
                          disabled={checkoutLoading === opt.tier}
                          data-testid={`button-upgrade-to-${opt.tier}`}
                        >
                          {checkoutLoading === opt.tier ? "Loading…" : "Upgrade"}
                        </Button>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground pt-1">
                      Upgrades are one-time payments. Your current access is preserved.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {activeTab === "profile" && (
            <>
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle>Child Profile</CardTitle>
                  <CardDescription>These details inform the forecast engine.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Child Nickname (this device only)</label>
                      {editingLegacyName ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={legacyNameDraft}
                            onChange={(e) => setLegacyNameDraft(e.target.value)}
                            placeholder="e.g. Alex"
                            className="flex-1 px-2 py-1 rounded-md border text-sm"
                            data-testid="input-legacy-child-name"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              if (user?.id) setLegacyChildName(user.id, legacyNameDraft);
                              setEditingLegacyName(false);
                              toast({ title: "Saved on this device" });
                            }}
                            data-testid="button-save-legacy-child-name"
                          >Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingLegacyName(false)}>Cancel</Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary" data-testid="text-legacy-child-name">
                            {getLegacyChildName(user?.id) || 'Not set'}
                          </span>
                          <button
                            type="button"
                            className="text-xs text-primary underline underline-offset-2 hover:opacity-80"
                            onClick={() => {
                              setLegacyNameDraft(getLegacyChildName(user?.id) || "");
                              setEditingLegacyName(true);
                            }}
                            data-testid="button-edit-legacy-child-name"
                          >Edit</button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Year Group</label>
                      <div className="font-medium text-primary">{user.childYear || 'Not set'}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Targeting</label>
                      <div className="font-medium text-primary">Bucks Grammar (121)</div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Test Window</label>
                      <div className="font-medium text-primary">September</div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Practice Hours</label>
                      <div className="font-medium text-primary">{user.practiceHours || 'Not set'}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Hardest Areas</label>
                      <div className="font-medium text-primary">{(user.difficultyAreas || []).join(', ') || 'None selected'}</div>
                    </div>
                  </div>
                  <div className="pt-4 mt-2 border-t border-border/50">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/app/onboarding">Retake Onboarding Questionnaire</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {(isFamilyTier() || profiles.length > 0) && (
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <CardTitle>Child Profiles</CardTitle>
                    </div>
                    <CardDescription>Manage up to 3 child profiles for your family account.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profiles.map((profile: any) => (
                      <div key={profile.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100" data-testid={`child-profile-${profile.id}`}>
                        {editingProfile === profile.id ? (
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-md border text-sm"
                              data-testid="input-edit-child-name"
                            />
                            <select
                              value={editYear}
                              onChange={(e) => setEditYear(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-md border text-sm"
                              data-testid="select-edit-child-year"
                            >
                              <option>Year 4</option>
                              <option>Year 5</option>
                              <option>Year 6</option>
                            </select>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setChildName(profile.id, editName);
                                  updateChildMutation.mutate({ id: profile.id, data: { childYear: editYear } });
                                }}
                                data-testid="button-save-edit-child"
                              >
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingProfile(null)}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-primary">{getChildName(profile.id) || "Child"}</span>
                                {profile.id === user.activeChildProfileId && (
                                  <Badge variant="secondary" className="text-xs">Active</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{profile.childYear} · Stage: {profile.stage || "exploring"}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingProfile(profile.id);
                                  setEditName(getChildName(profile.id) || "");
                                  setEditYear(profile.childYear);
                                }}
                                data-testid={`button-edit-child-${profile.id}`}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  if (confirm("Remove this child profile? Their progress data will be preserved.")) {
                                    deleteChildMutation.mutate(profile.id);
                                  }
                                }}
                                data-testid={`button-remove-child-${profile.id}`}
                              >
                                Remove
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                    {profiles.length < 3 && isFamilyTier() && (
                      addingChild ? (
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                          <input
                            type="text"
                            placeholder="Child's first name (saved on this device only)"
                            value={newChildName}
                            onChange={(e) => setNewChildName(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border text-sm"
                            data-testid="input-account-new-child-name"
                          />
                          <select
                            value={newChildYear}
                            onChange={(e) => setNewChildYear(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border text-sm"
                            data-testid="select-account-new-child-year"
                          >
                            <option>Year 4</option>
                            <option>Year 5</option>
                            <option>Year 6</option>
                          </select>
                          <p className="text-xs text-muted-foreground">
                            The nickname stays in your browser — we never send it to our servers.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => addChildMutation.mutate()}
                              disabled={addChildMutation.isPending}
                              data-testid="button-confirm-account-add-child"
                            >
                              Add Child
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setAddingChild(false)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setAddingChild(true)}
                          data-testid="button-account-add-child"
                        >
                          + Add Child Profile
                        </Button>
                      )
                    )}
                  </CardContent>
                </Card>
              )}

              {isProgramme() && (
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <CardTitle>Exam Date</CardTitle>
                    </div>
                    <CardDescription>Set your child's exam date for the countdown timer on your dashboard.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Exam Date</label>
                        <input
                          type="date"
                          value={examDate || (testDayConfig?.examDate ? new Date(testDayConfig.examDate).toISOString().split("T")[0] : "")}
                          onChange={(e) => setExamDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-md border text-sm"
                          data-testid="input-exam-date"
                        />
                      </div>
                      <Button
                        onClick={() => saveExamDateMutation.mutate()}
                        disabled={!examDate || saveExamDateMutation.isPending}
                        data-testid="button-save-exam-date"
                      >
                        Save
                      </Button>
                    </div>
                    {testDayConfig?.examDate && (
                      <p className="text-sm text-muted-foreground">
                        Current exam date: {new Date(testDayConfig.examDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <CardTitle>Email Preferences</CardTitle>
                  </div>
                  <CardDescription>Manage your email communication preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <p className="font-medium text-primary">Progress updates & tips</p>
                      <p className="text-sm text-muted-foreground">Receive helpful emails about your child's progress, practice reminders, and preparation tips.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer" data-testid="toggle-email-consent">
                      <input
                        type="checkbox"
                        checked={user.emailConsent}
                        onChange={(e) => emailConsentMutation.mutate(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    <CardTitle>Your Data</CardTitle>
                  </div>
                  <CardDescription>Download a copy of everything we hold about your account (UK GDPR right to portability).</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-medium text-primary">Download my data</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Receive your account, child profiles, test sessions, answers and email history as a single JSON file.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => dataExportMutation.mutate()}
                      disabled={dataExportMutation.isPending}
                      data-testid="button-export-data"
                    >
                      {dataExportMutation.isPending ? "Preparing…" : "Download"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 shadow-sm bg-red-50/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <CardTitle className="text-red-700">Danger Zone</CardTitle>
                  </div>
                  <CardDescription>Permanent actions that cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-medium text-red-700">Delete Account</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Permanently delete your account and all associated data. This cannot be undone. Any active subscription will be cancelled immediately.</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 shrink-0"
                      onClick={() => { setShowDeleteModal(true); setDeleteStep("retention"); setDeleteConfirmText(""); setDeleteStripeError(false); }}
                      data-testid="button-open-delete-account"
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

        </div>
      </div>
    </div>

    {showCancelModal && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="modal-cancel-subscription">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
          {cancelResult ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900">Subscription cancelled</h2>
                  <p className="text-sm text-muted-foreground">
                    {cancelResult?.accessUntil
                      ? `You keep full access until ${new Date(cancelResult.accessUntil).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. No further payments will be taken.`
                      : "Your subscription will end at the current billing period. You keep full access until then."
                    }
                  </p>
                </div>
              </div>
              <Button className="w-full" onClick={() => setShowCancelModal(false)} data-testid="button-cancel-modal-close">
                Close
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900">Cancel your subscription?</h2>
                  <p className="text-sm text-muted-foreground">Please confirm you want to cancel.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 space-y-1">
                <p>Your subscription will remain active until the end of the current billing period.</p>
                <p className="text-muted-foreground">No future payments will be taken after cancellation.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => cancelSubscriptionMutation.mutate()}
                  disabled={cancelSubscriptionMutation.isPending}
                  data-testid="button-confirm-cancel-subscription"
                >
                  {cancelSubscriptionMutation.isPending ? "Cancelling…" : "Yes, cancel my subscription"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelSubscriptionMutation.isPending}
                  data-testid="button-cancel-modal-back"
                >
                  Keep my subscription
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    )}

    {showDeleteModal && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="modal-delete-account">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">

          {deleteStep === "retention" && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900">Before you go…</h2>
                  <p className="text-sm text-muted-foreground">Are you sure you want to delete your account?</p>
                </div>
              </div>
              <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside pl-1">
                <li>Deleting your account will permanently remove your data.</li>
                <li>If you have an active subscription, it will be cancelled immediately — you will not be charged for any future billing period.</li>
                <li>This action cannot be undone.</li>
              </ul>
              {hasStripeAccount && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
                  If you only want to stop being charged, you can cancel your subscription without deleting your account.
                </div>
              )}
              <div className="flex flex-col gap-2 pt-1">
                {hasStripeAccount && (
                  <Button
                    variant="outline"
                    className="w-full border-slate-300"
                    onClick={() => { setShowDeleteModal(false); manageBillingMutation.mutate(); }}
                    disabled={manageBillingMutation.isPending}
                    data-testid="button-cancel-subscription-only"
                  >
                    Cancel subscription only
                  </Button>
                )}
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => setDeleteStep("confirm")}
                  data-testid="button-delete-account-anyway"
                >
                  Delete account anyway
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-slate-500"
                  onClick={() => setShowDeleteModal(false)}
                  data-testid="button-retention-cancel"
                >
                  Keep my account
                </Button>
              </div>
            </>
          )}

          {deleteStep === "confirm" && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900">Final confirmation</h2>
                  <p className="text-sm text-muted-foreground">Type DELETE below to confirm permanent deletion.</p>
                </div>
              </div>

              {deleteStripeError && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-sm text-red-700" data-testid="error-stripe-cancel">
                  We could not cancel your subscription right now. Please try again in a moment, or contact support if this continues.
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Type <strong>DELETE</strong> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => { setDeleteConfirmText(e.target.value); setDeleteStripeError(false); }}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="DELETE"
                  data-testid="input-delete-confirm"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setDeleteStep("retention"); setDeleteConfirmText(""); setDeleteStripeError(false); }}
                  disabled={deleteAccountMutation.isPending}
                  data-testid="button-back-retention"
                >
                  Back
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={deleteConfirmText !== "DELETE" || deleteAccountMutation.isPending}
                  onClick={() => deleteAccountMutation.mutate()}
                  data-testid="button-confirm-delete"
                >
                  {deleteAccountMutation.isPending ? "Deleting…" : "Delete Account"}
                </Button>
              </div>
            </>
          )}

        </div>
      </div>
    )}
    </>
  );
}
