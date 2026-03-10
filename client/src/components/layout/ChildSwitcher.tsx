import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth";
import { useState } from "react";
import { apiRequest } from "../../lib/queryClient";

export default function ChildSwitcher() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newYear, setNewYear] = useState("Year 5");

  const { data: profiles = [] } = useQuery<any[]>({
    queryKey: ["/api/child-profiles"],
    enabled: !!user,
  });

  const activateMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const res = await apiRequest("PUT", `/api/child-profiles/${profileId}/activate`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/child-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/test-sessions"] });
      setOpen(false);
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/child-profiles", {
        childName: newName,
        childYear: newYear,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/child-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setShowAdd(false);
      setNewName("");
    },
  });

  if (!user || profiles.length === 0) return null;

  const activeProfile = profiles.find((p: any) => p.id === user.activeChildProfileId);
  const displayName = activeProfile?.childName || user.childName || user.username;

  const isFamilyTier = user.subscriptionTier?.includes("family");
  if (!isFamilyTier && profiles.length <= 1) return null;

  return (
    <div className="relative" data-testid="child-switcher">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-medium"
        data-testid="button-switch-child"
      >
        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span>{displayName}</span>
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-card rounded-lg border shadow-lg z-50 p-2" data-testid="child-switcher-dropdown">
          {profiles.map((p: any) => (
            <button
              key={p.id}
              onClick={() => activateMutation.mutate(p.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 ${
                p.id === user.activeChildProfileId
                  ? "bg-primary/10 font-semibold text-primary"
                  : "hover:bg-muted"
              }`}
              data-testid={`button-child-profile-${p.id}`}
            >
              <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {p.childName.charAt(0).toUpperCase()}
              </span>
              <div>
                <p>{p.childName}</p>
                <p className="text-xs text-muted-foreground">{p.childYear}</p>
              </div>
              {p.id === user.activeChildProfileId && (
                <span className="ml-auto text-emerald-500">✓</span>
              )}
            </button>
          ))}

          {profiles.length < 3 && isFamilyTier && (
            <>
              {showAdd ? (
                <div className="border-t mt-2 pt-2 space-y-2">
                  <input
                    type="text"
                    placeholder="Child's name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md border text-sm"
                    data-testid="input-new-child-name"
                  />
                  <select
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md border text-sm"
                    data-testid="select-new-child-year"
                  >
                    <option>Year 4</option>
                    <option>Year 5</option>
                    <option>Year 6</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addMutation.mutate()}
                      disabled={!newName.trim() || addMutation.isPending}
                      className="flex-1 bg-primary text-primary-foreground text-sm py-1.5 rounded-md disabled:opacity-50"
                      data-testid="button-confirm-add-child"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAdd(false)}
                      className="flex-1 border text-sm py-1.5 rounded-md"
                      data-testid="button-cancel-add-child"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAdd(true)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-primary hover:bg-muted border-t mt-2 pt-2"
                  data-testid="button-add-child"
                >
                  + Add Child
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
