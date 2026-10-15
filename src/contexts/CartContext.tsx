import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "../data/types";
import { useAuth } from "./AuthContext";
import { commerceApi, type CartDto } from "../services/commerce";
import { userMessageFor } from "../services/api";

export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  price: number;
  quantity: number;
  image: string;
  store: { id: string; name: string; logo: string; slug: string };
  size?: string;
  color?: string;
  pointsReward: number;
  currency: string;
  isAvailable: boolean;
  availabilityMessage: string | null;
  stockQuantity: number | null;
  inventoryTrackingEnabled: boolean;
}

interface CartContextValue {
  items: CartItem[];
  subtotal: number;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  addItem: (product: Product, quantity: number, size?: string, color?: string, variantId?: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, newQty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
  getTotal: () => number;
  getPointsTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

function mapCart(dto: CartDto): CartItem[] {
  return dto.items.map(item => ({
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    name: item.productName,
    price: Number(item.price),
    quantity: item.quantity,
    image: item.productImage || "/icons/icon-512.svg",
    store: { id: item.storeId, name: item.storeName, logo: "/icons/icon-512.svg", slug: item.storeSlug },
    size: item.variantSku || undefined,
    pointsReward: 0,
    currency: "COP",
    isAvailable: item.isAvailable,
    availabilityMessage: item.availabilityMessage,
    stockQuantity: item.stockQuantity,
    inventoryTrackingEnabled: item.inventoryTrackingEnabled,
  }));
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) { setItems([]); setSubtotal(0); return; }
    setError(null);
    setIsLoading(true);
    try { const cart = await commerceApi.cart(); setItems(mapCart(cart)); setSubtotal(Number(cart.subtotal)); }
    catch (requestError) { setError(userMessageFor(requestError)); throw requestError; }
    finally { setIsLoading(false); }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setItems([]); setSubtotal(0); setError(null); return; }
    void refresh().catch(() => undefined);
  }, [authLoading, isAuthenticated, refresh]);

  const mutate = useCallback(async (operation: () => Promise<unknown>) => {
    setIsMutating(true);
    setError(null);
    try { await operation(); await refresh(); }
    catch (requestError) { await refresh().catch(() => undefined); setError(userMessageFor(requestError)); throw requestError; }
    finally { setIsMutating(false); }
  }, [refresh]);

  const addItem = useCallback((product: Product, quantity: number, _size?: string, _color?: string, variantId?: string) => {
    if (!Number.isInteger(quantity) || quantity < 1) return Promise.reject(new Error("La cantidad debe ser mayor que cero."));
    return mutate(() => commerceApi.addCartItem(product.id, quantity, variantId));
  }, [mutate]);
  const removeItem = useCallback((id: string) => mutate(() => commerceApi.removeCartItem(id)), [mutate]);
  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1) return Promise.reject(new Error("La cantidad debe ser mayor que cero."));
    return mutate(() => commerceApi.updateCartItem(id, quantity));
  }, [mutate]);
  const clearCart = useCallback(() => mutate(() => commerceApi.clearCart()), [mutate]);

  const getTotal = useCallback(() => subtotal, [subtotal]);
  const getPointsTotal = useCallback(() => 0, []);
  const getItemCount = useCallback(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const value = useMemo(() => ({
    items, subtotal, isLoading, isMutating, error, addItem, removeItem, updateQuantity, clearCart, refresh,
    getTotal, getPointsTotal, getItemCount,
  }), [items, subtotal, isLoading, isMutating, error, addItem, removeItem, updateQuantity, clearCart, refresh, getTotal, getPointsTotal, getItemCount]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
