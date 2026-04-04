import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, User, Users, Calendar, Mail, ExternalLink, ArrowRight, TrendingUp, AlertTriangle } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { Link, useLocation } from "wouter";
import { useAuth } from "../lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type Tab = "profile" | "subscription";

const UPGRADE_OPTIONS: Record<string, { tier: string; label: string; price: string; description: string }[]> = {
  pack_monthly: [
    { tier: "pack_plus", label: "Bucks Practice Platform Edge", price: "£59.99/mo", description: "Full access: all Hard drills, mock exams, analytics, roadmap & weekly plans." },
    { tier: "pack_annual", label: "Bucks Practice Platform Edge — Annual", price: "£495/yr", description: "Full access for 12 months — save £224.88 vs monthly Edge." },
    { tier: "programme24_plus", label: "Bucks Young Scholar Programme", price: "£349", description: "6 months of full access, one payment. Same features as Edge." },
  ],
  pack_plus: [
    { tier: "pack_annual", label: "Bucks Practice Platform Edge — Annual", price: "£495/yr", description: "Lock in 12 months of full access — save £224.88 vs staying monthly." },
    { tier: "programme24_plus", label: "Bucks Young Scholar Programme", price: "£349", description: "6-month fixed plan at one payment — cancel your monthly subscription." },
  ],
  pack_annual: [],
  pack12: [
    { tier: "pack_plus", label: "Bucks Practice Platform Edge", price: "£59.99/mo", description: "Unlock all 17 Hard drills, premium analytics and mock exams." },
    { tier: "pack_annual", label: "Bucks Practice Platform Edge — Annual", price: "£495/yr", description: "Upgrade to full annual access and save." },
    { tier: "programme24_plus", label: "Bucks Young Scholar Programme", price: "£349", description: "Full all-inclusive 6-month plan." },
  ],
  programme8: [
    { tier: "programme12", label: "12-Week Structured Programme", price: "£89", description: "Extend with a longer structured roadmap." },
    { tier: "programme24_plus", label: "Programme+ (6 months)", price: "£349", description: "Full 6-month all-inclusive plan." },
  ],
  programme12: [
    { tier: "programme24_plus", label: "Programme+ (6 months)", price: "£349", description: "Upgrade to the full 6-month all-inclusive plan." },
  ],
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
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [newChildSchool, setNewChildSchool] = useState("");
  const [examDate, setExamDate] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

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
        childName: newChildName,
        childYear: newChildYear,
        targetSchool: newChildSchool || undefined,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/child-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setAddingChild(false);
      setNewChildName("");
      setNewChildSchool("");
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/child-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
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

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/user");
    },
    onSuccess: () => {
      setLocation("/");
    },
    onError: () => {
      toast({ title: "Could not delete account", description: "Please try again or contact support.", variant: "destructive" });
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
  const isTopTier = currentTier === "programme24_plus" || currentTier === "programme16_family" || currentTier === "programme16";
  const hasStripeAccount = !!user.stripeCustomerId;

  const tierDescriptions: Record<string, string> = {
    free: "Limited to Mini Diagnostic and basic drills.",
    early_learner: "Foundation-level practice for Year 4 & 5. 6 months of access.",
    pack12: "Full access to all diagnostics, drills, PDF reports, and progress tracking for 12 weeks.",
    pack12_family: "Full access for up to 3 children. 12 weeks of access.",
    pack_monthly: "Full access to all diagnostics, drills, PDF reports, and progress tracking. Renews monthly — cancel anytime.",
    pack_annual: "12 months of full access — one-time payment: all Hard drills, mock exams, analytics, roadmap, milestone diagnostics and weekly plans.",
    programme8: "8-week structured programme with milestone diagnostics, advanced analytics, and a personalised weekly plan.",
    programme12: "12-week structured programme — subscriber add-on with milestone diagnostics and a personalised weekly plan.",
    programme24_plus: "6-month Programme+ with full structured roadmap, milestone diagnostics, advanced analytics, and priority support.",
    programme16: "Full access including 16-week structured roadmap, milestone diagnostics, advanced analytics, and weekly plans.",
    programme16_family: "Full programme access for up to 3 children. 16 weeks of access.",
  };

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile Details", icon: <User className="h-4 w-4" /> },
    { id: "subscription", label: "Subscription", icon: <CreditCard className="h-4 w-4" /> },
  ];

  return (
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
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tierDescriptions[currentTier] || "Limited access."}
                        </p>
                        {user.subscriptionExpiresAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Access expires: {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                          </p>
                        )}
                        {currentTier === "pack_monthly" && (
                          <p className="text-xs text-muted-foreground mt-1">Renews monthly. Cancel any time before your next billing date.</p>
                        )}
                        {user.trialEndsAt && new Date(user.trialEndsAt) > new Date() && (
                          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200" data-testid="banner-account-trial">
                            <p className="text-xs font-semibold text-amber-900">
                              Free trial — {Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                            </p>
                            <p className="text-xs text-amber-700 mt-0.5">
                              Nothing charged until {new Date(user.trialEndsAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}. Cancel before then to pay nothing.
                            </p>
                            <Button
                              size="sm"
                              className="mt-2 h-7 text-xs"
                              onClick={() => manageBillingMutation.mutate()}
                              disabled={manageBillingMutation.isPending}
                              data-testid="button-convert-trial"
                            >
                              Convert to Paid Plan
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {hasStripeAccount && (
                    <div className="space-y-3 pt-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Billing</p>
                      <Button
                        variant="outline"
                        className="w-full justify-between h-12"
                        onClick={() => manageBillingMutation.mutate()}
                        disabled={manageBillingMutation.isPending}
                        data-testid="button-manage-billing"
                      >
                        <span className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {user.trialEndsAt && new Date(user.trialEndsAt) > new Date()
                              ? "Manage billing & cancel trial"
                              : currentTier === "pack_monthly" || currentTier === "pack_plus"
                                ? "Manage billing & cancel subscription"
                                : "Manage billing"}
                          </span>
                        </span>
                        {manageBillingMutation.isPending && (
                          <span className="text-xs text-muted-foreground">Opening…</span>
                        )}
                      </Button>
                      {user.trialEndsAt && new Date(user.trialEndsAt) > new Date() ? (
                        <p className="text-xs text-muted-foreground px-1">
                          Cancel anytime before your trial ends to pay nothing. Access stops immediately on cancellation.
                        </p>
                      ) : (currentTier === "pack_monthly" || currentTier === "pack_plus") && (
                        <p className="text-xs text-muted-foreground px-1">
                          Cancellation takes effect at the end of your current billing period. You keep full access until then.
                        </p>
                      )}
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
                      <label className="text-xs font-medium text-muted-foreground">Child Name</label>
                      <div className="font-medium text-primary">{user.childName || 'Not set'}</div>
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
                                onClick={() => updateChildMutation.mutate({ id: profile.id, data: { childName: editName, childYear: editYear } })}
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
                                <span className="font-bold text-primary">{profile.childName}</span>
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
                                  setEditName(profile.childName);
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
                            placeholder="Child's name"
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
                          <select
                            value={newChildSchool}
                            onChange={(e) => setNewChildSchool(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border text-sm"
                            data-testid="select-account-new-child-school"
                          >
                            <option value="">Target school (optional)</option>
                            {["Aylesbury Grammar School","Aylesbury High School","Beaconsfield High School","Burnham Grammar School","Chesham Grammar School","Dr Challoner's Grammar School","Dr Challoner's High School","John Hampden Grammar School","Royal Grammar School (High Wycombe)","Royal Latin School","Sir Henry Floyd Grammar School","Sir William Borlase's Grammar School","Wycombe High School","Not sure yet","Other"].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => addChildMutation.mutate()}
                              disabled={!newChildName.trim() || addChildMutation.isPending}
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
                      onClick={() => { setShowDeleteModal(true); setDeleteConfirmText(""); }}
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

    {showDeleteModal && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="modal-delete-account">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900">Delete your account?</h2>
              <p className="text-sm text-muted-foreground">This will permanently remove all your data.</p>
            </div>
          </div>
          <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside pl-1">
            <li>All test sessions, results, and progress data will be deleted</li>
            <li>Any active subscription or free trial will be cancelled immediately</li>
            <li>Your account cannot be recovered</li>
          </ul>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Type <strong>DELETE</strong> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="DELETE"
              data-testid="input-delete-confirm"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteAccountMutation.isPending}
              data-testid="button-cancel-delete"
            >
              Cancel
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
        </div>
      </div>
    )}
  );
}
