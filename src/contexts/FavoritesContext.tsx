import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { favoritesApi, type FavoriteProduct } from "../services/favorites";
import { userMessageFor } from "../services/api";

interface FavoritesContextValue {
  favorites: FavoriteProduct[];
  favoriteIds: ReadonlySet<string>;
  isLoading: boolean;
  error: string | null;
  pendingIds: ReadonlySet<string>;
  refresh: () => Promise<void>;
  setFavorite: (productId: string, shouldBeFavorite: boolean) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const requestVersion = useRef(0);
  const activeUserId = useRef<string | null>(null);
  const pendingOperations = useRef(new Set<string>());

  const refresh = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setError(null);
      return;
    }
    const version = ++requestVersion.current;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    try {
      const result = await favoritesApi.list(controller.signal);
      if (version === requestVersion.current && activeUserId.current === user.id) {
        setFavorites(result);
        setFavoriteIds(new Set(result.map(item => item.id)));
      }
    } catch (requestError) {
      if (version === requestVersion.current && activeUserId.current === user.id) setError(userMessageFor(requestError));
    } finally {
      controller.abort();
      if (version === requestVersion.current && activeUserId.current === user.id) setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthLoading) return;
    activeUserId.current = user?.id ?? null;
    setFavorites([]);
    setFavoriteIds(new Set());
    setError(null);
    setPendingIds(new Set());
    pendingOperations.current.clear();
    if (!user) {
      requestVersion.current += 1;
      setIsLoading(false);
      return;
    }
    void refresh();
    return () => { requestVersion.current += 1; };
  }, [isAuthLoading, refresh, user]);

  const setFavorite = useCallback(async (productId: string, shouldBeFavorite: boolean) => {
    if (!user) throw new Error("Inicia sesión para guardar tus favoritos.");
    const operationKey = `${user.id}:${productId}`;
    if (pendingOperations.current.has(operationKey)) return;
    const currentlyFavorite = favoriteIds.has(productId);
    if (currentlyFavorite === shouldBeFavorite) return;
    pendingOperations.current.add(operationKey);
    setPendingIds(current => new Set(current).add(productId));
    try {
      if (shouldBeFavorite) await favoritesApi.add(productId);
      else await favoritesApi.remove(productId);
      if (activeUserId.current !== user.id) return;
      setFavoriteIds(current => {
        const next = new Set(current);
        if (shouldBeFavorite) next.add(productId);
        else next.delete(productId);
        return next;
      });
      if (!shouldBeFavorite) {
        requestVersion.current += 1;
        setFavorites(current => current.filter(item => item.id !== productId));
      }
      // The add response contains only the ID; list again rather than inventing product data.
      if (shouldBeFavorite) await refresh();
    } catch (requestError) {
      if (activeUserId.current === user.id) setError(userMessageFor(requestError));
      throw requestError;
    } finally {
      pendingOperations.current.delete(operationKey);
      if (activeUserId.current === user.id) setPendingIds(current => {
          const next = new Set(current);
          next.delete(productId);
          return next;
        });
    }
  }, [favoriteIds, refresh, user]);

  const value = useMemo(() => ({ favorites, favoriteIds, isLoading, error, pendingIds, refresh, setFavorite }), [favorites, favoriteIds, isLoading, error, pendingIds, refresh, setFavorite]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
