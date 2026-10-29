import { api } from "./api";

export interface FavoriteProduct {
  id: string;
  name: string | null;
  slug: string | null;
  description: string | null;
  base_price: string | null;
  compare_at_price: string | null;
  status: string | null;
  inventory_tracking_enabled: boolean | null;
  stock_quantity: number | null;
  favorited_at: string;
  image_url: string | null;
  availability: "available" | "unavailable";
  is_navigable: 0 | 1;
}

export const favoritesApi = {
  async list(signal?: AbortSignal): Promise<FavoriteProduct[]> {
    const result = await api.get<{ favorites: FavoriteProduct[] }>("/favorites", signal);
    return result.favorites;
  },
  async add(productId: string): Promise<{ productId: string; created: boolean }> {
    return api.post<{ productId: string; created: boolean }>("/favorites", { productId });
  },
  async remove(productId: string): Promise<void> {
    await api.delete<{ removed: boolean }>(`/favorites/${encodeURIComponent(productId)}`);
  },
};
