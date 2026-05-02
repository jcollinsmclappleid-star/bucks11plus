import { useSyncExternalStore } from "react";

const KEY = "b11p_child_names_v1";
const LEGACY_PREFIX = "legacy:";

type NameMap = Record<string, string>;

const listeners = new Set<() => void>();
let snapshot = "";

function readRaw(): string {
  try {
    return (typeof window !== "undefined" ? localStorage.getItem(KEY) : null) ?? "";
  } catch {
    return "";
  }
}

function read(): NameMap {
  try {
    const raw = readRaw();
    return raw ? (JSON.parse(raw) as NameMap) : {};
  } catch {
    return {};
  }
}

function notify() {
  snapshot = readRaw();
  listeners.forEach((fn) => fn());
}

function write(map: NameMap) {
  try {
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* localStorage may be unavailable (private mode etc.) — silently no-op */
  }
  notify();
}

if (typeof window !== "undefined") {
  snapshot = readRaw();
  window.addEventListener("storage", (e) => {
    if (e.key === KEY || e.key === null) notify();
  });
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return "";
}

export function useChildNamesVersion(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useChildName(profileId: string | null | undefined): string | null {
  useChildNamesVersion();
  return getChildName(profileId);
}

export function useLegacyChildName(userId: string | null | undefined): string | null {
  useChildNamesVersion();
  return getLegacyChildName(userId);
}

export function useDisplayName(
  activeProfileId: string | null | undefined,
  userId: string | null | undefined,
  fallback: string = "your child",
): string {
  useChildNamesVersion();
  return getDisplayName(activeProfileId, userId, fallback);
}

export function getChildName(profileId: string | null | undefined): string | null {
  if (!profileId) return null;
  return read()[profileId] ?? null;
}

export function setChildName(profileId: string, name: string) {
  if (!profileId) return;
  const trimmed = name.trim();
  const map = read();
  if (trimmed) {
    map[profileId] = trimmed.slice(0, 60);
  } else {
    delete map[profileId];
  }
  write(map);
}

export function removeChildName(profileId: string) {
  if (!profileId) return;
  const map = read();
  delete map[profileId];
  write(map);
}

export function clearAllChildNames() {
  try {
    if (typeof window !== "undefined") localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function getLegacyChildName(userId: string | null | undefined): string | null {
  if (!userId) return null;
  return getChildName(LEGACY_PREFIX + userId);
}

export function setLegacyChildName(userId: string, name: string) {
  setChildName(LEGACY_PREFIX + userId, name);
}

export function getDisplayName(
  activeProfileId: string | null | undefined,
  userId: string | null | undefined,
  fallback: string = "your child",
): string {
  const fromProfile = getChildName(activeProfileId);
  if (fromProfile) return fromProfile;
  const fromLegacy = getLegacyChildName(userId);
  if (fromLegacy) return fromLegacy;
  return fallback;
}
