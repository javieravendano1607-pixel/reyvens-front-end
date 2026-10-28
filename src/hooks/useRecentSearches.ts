import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "reyvens:recent-searches:v1";
const MAX_RECENT_SEARCHES = 10;
const MAX_SEARCH_LENGTH = 80;
const CHANGE_EVENT = "reyvens:recent-searches-change";

function normalizeSearch(value: string): string {
  return value.trim().replace(/\s+/g, " ").slice(0, MAX_SEARCH_LENGTH);
}

function isSafeSearch(value: string): boolean {
  const hasEmail = /\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/i.test(value);
  const hasSensitiveTerm = /\b(password|contrase(?:n|ñ)a|token|bearer|jwt|cvv|tarjeta|clave privada)\b/i.test(value);
  const hasLongNumber = /(?:\d[\s().+-]*){8,}/.test(value);
  return !hasEmail && !hasSensitiveTerm && !hasLongNumber;
}

function readRecentSearches(): string[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    const seen = new Set<string>();
    return value
      .filter((item): item is string => typeof item === "string")
      .map(normalizeSearch)
      .filter(item => {
        if (!isSafeSearch(item)) return false;
        const key = item.toLocaleLowerCase("es-CO");
        if (!item || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

function writeRecentSearches(searches: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Storage can be unavailable in private browsing or restricted environments.
  }
}

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readRecentSearches(),
  );

  useEffect(() => {
    const sync = () => setRecentSearches(readRecentSearches());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addRecentSearch = useCallback((value: string) => {
    const search = normalizeSearch(value);
    if (!search || !isSafeSearch(search)) return;
    const key = search.toLocaleLowerCase("es-CO");
    const next = [search, ...readRecentSearches().filter(item => item.toLocaleLowerCase("es-CO") !== key)]
      .slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(next);
    writeRecentSearches(next);
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    writeRecentSearches([]);
  }, []);

  return { recentSearches, addRecentSearch, clearRecentSearches };
}
