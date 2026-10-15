import { useCallback, useEffect, useState } from "react";
import { marketplaceApi } from "../services/marketplace";
import type { CategoryItem, Product } from "../data/types";
import { userMessageFor } from "../services/api";

export function useCatalogProducts(options: { categoryId?: string; storeId?: string } = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const categoryId = options.categoryId;
  const storeId = options.storeId;
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try { setProducts(await marketplaceApi.products({ categoryId, storeId })); }
    catch (requestError) { setError(userMessageFor(requestError)); }
    finally { setIsLoading(false); }
  }, [categoryId, storeId]);
  useEffect(() => { void refresh(); }, [refresh]);
  return { products, isLoading, error, refresh };
}

export function useCatalogCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try { setCategories(await marketplaceApi.categories()); }
    catch (requestError) { setError(userMessageFor(requestError)); }
    finally { setIsLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  return { categories, isLoading, error, refresh };
}
