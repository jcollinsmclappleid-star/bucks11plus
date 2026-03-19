import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, User, Users, Calendar, Mail, ExternalLink } from "lucide-react";
import { Seo } from "../components/shared/Seo";
import { Link } from "wouter";
import { useAuth } from "../lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Account() {
  const { user, tierLabel, hasPaidAccess, isFamilyTier, isProgramme } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editYear, setEditYear] = useState("");
  const [addingChild, setAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildYear, setNewChildYear] = useState("Year 5");
  const [newChildSchool, setNewChildSchool] = useState("");
  const [examDate, setExamDate] = useState("");

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

  if (!user) return null;

  const tierDescriptions: Record<string, string> = {
    free: "Limited to Mini Diagnostic and basic drills.",
    early_learner: "Foundation-level practice for Year 4 & 5. 6 months of access.",
    pack12: "Full access to all diagnostics, drills, PDF reports, and progress tracking for 12 weeks.",
    pack12_family: "Full access for up to 3 children. 12 weeks of access.",
    pack_monthly: "Full access to all diagnostics, drills, PDF reports, and progress tracking. Renews monthly — cancel anytime.",
    programme8: "8-week structured programme with milestone diagnostics, advanced analytics, and a personalised weekly plan.",
    programme12: "12-week structured programme — subscriber add-on with milestone diagnostics and a personalised weekly plan.",
    programme24_plus: "24-week Programme+ with full structured roadmap, milestone diagnostics, advanced analytics, and priority support.",
    programme16: "Full access including 16-week structured roadmap, milestone diagnostics, advanced analytics, and weekly plans.",
    programme16_family: "Full programme access for up to 3 children. 16 weeks of access.",
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      <Seo title="Account | 11+ Standard" description="Manage your account settings and subscription." />
      
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-3xl font-bold text-primary font-serif">Account Settings</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button variant="secondary" className="justify-start gap-2 text-primary font-medium w-full">
            <User className="h-4 w-4" /> Profile Details
          </Button>
          <Button variant="ghost" className="justify-start gap-2 text-muted-foreground w-full">
            <CreditCard className="h-4 w-4" /> Subscription
          </Button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Manage your access to 11+ Standard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-primary text-lg" data-testid="text-tier-name">{tierLabel()}</span>
                    <Badge variant="secondary" className="bg-slate-200">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tierDescriptions[user.subscriptionTier] || "Limited access."}
                  </p>
                  {user.subscriptionExpiresAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Access expires: {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {!hasPaidAccess() && (
                    <Button variant="outline" asChild data-testid="button-upgrade-account">
                      <Link href="/pricing">Upgrade</Link>
                    </Button>
                  )}
                  {user.subscriptionTier === "pack_monthly" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => manageBillingMutation.mutate()}
                      disabled={manageBillingMutation.isPending}
                      data-testid="button-manage-billing"
                      className="gap-1.5"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {manageBillingMutation.isPending ? "Opening…" : "Manage Billing"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

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
        </div>

      </div>
    </div>
  );
}
