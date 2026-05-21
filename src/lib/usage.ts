// Lightweight client-only usage tracker stored in localStorage.
// Each feature records: runs count, last run timestamp, and total output chars.

export type UsageKind = "email" | "meetings" | "tasks" | "research" | "chat";

export interface UsageStat {
  runs: number;
  lastRun: number | null;
  chars: number;
}

export type UsageMap = Record<UsageKind, UsageStat>;

const STORAGE_KEY = "aurora.usage.v1";
const EVENT = "aurora:usage-updated";

const KINDS: UsageKind[] = ["email", "meetings", "tasks", "research", "chat"];

function empty(): UsageMap {
  return KINDS.reduce((acc, k) => {
    acc[k] = { runs: 0, lastRun: null, chars: 0 };
    return acc;
  }, {} as UsageMap);
}

export function readUsage(): UsageMap {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<UsageMap>;
    const base = empty();
    for (const k of KINDS) {
      if (parsed[k]) base[k] = { ...base[k], ...parsed[k]! };
    }
    return base;
  } catch {
    return empty();
  }
}

export function recordUsage(kind: UsageKind, chars = 0) {
  if (typeof window === "undefined") return;
  const data = readUsage();
  data[kind] = {
    runs: data[kind].runs + 1,
    lastRun: Date.now(),
    chars: data[kind].chars + Math.max(0, chars),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* ignore quota */
  }
}

export function resetUsage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(EVENT));
}

import { useEffect, useState } from "react";

export function useUsage(): UsageMap {
  const [data, setData] = useState<UsageMap>(() => readUsage());
  useEffect(() => {
    const update = () => setData(readUsage());
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return data;
}

export function formatRelative(ts: number | null): string {
  if (!ts) return "Never used";
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
