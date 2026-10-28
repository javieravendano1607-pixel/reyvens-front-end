/** Demo mode is an opt-in development preview and is always disabled in production builds. */
export const isDemoMode = import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE === "true";

export const isDemoProductId = (id: string): boolean => id.startsWith("demo-product-");
export const isDemoStoreId = (id: string): boolean => id.startsWith("demo-store-");
