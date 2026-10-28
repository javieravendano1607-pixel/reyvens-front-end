import { useCallback, useEffect, useRef, useState } from "react";
import { marketplaceApi } from "../services/marketplace";
import type { CategoryItem, Product } from "../data/types";
import { userMessageFor } from "../services/api";
import { demoCategories, demoProducts } from "../data/demo/catalog";
import { isDemoMode } from "../data/demo/demoMode";

export function useCatalogProducts(options: { categoryId?: string; storeId?: string } = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);
  const categoryId = options.categoryId;
  const storeId = options.storeId;
  const refresh = useCallback(async () => {
    const requestId = ++requestSequence.current;
    setIsLoading(true);
    setError(null);
    try {
      if (isDemoMode) {
        const result = demoProducts.filter(product =>
          (!categoryId || product.categoryId === categoryId) &&
          (!storeId || product.store.id === storeId),
        );
        if (requestId === requestSequence.current) setProducts(result);
        return;
      }
      const result = await marketplaceApi.products({ categoryId, storeId });
      if (requestId === requestSequence.current) setProducts(result);
    }
    catch (requestError) { if (requestId === requestSequence.current) setError(userMessageFor(requestError)); }
    finally { if (requestId === requestSequence.current) setIsLoading(false); }
  }, [categoryId, storeId]);
  useEffect(() => { void refresh(); return () => { requestSequence.current += 1; }; }, [refresh]);
  return { products, isLoading, error, refresh };
}

export function useCatalogCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);
  const refresh = useCallback(async () => {
    const requestId = ++requestSequence.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = isDemoMode ? demoCategories : await marketplaceApi.categories();
      if (requestId === requestSequence.current) setCategories(result);
    }
    catch (requestError) { if (requestId === requestSequence.current) setError(userMessageFor(requestError)); }
    finally { if (requestId === requestSequence.current) setIsLoading(false); }
  }, []);
  useEffect(() => { void refresh(); return () => { requestSequence.current += 1; }; }, [refresh]);
  return { categories, isLoading, error, refresh };
}
