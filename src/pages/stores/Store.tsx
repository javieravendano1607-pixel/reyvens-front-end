import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { ProductGrid } from "../../components/common/ProductGrid";
import type { StoreInfo, Product } from "../../data/types";
import { marketplaceApi } from "../../services/marketplace";
import { userMessageFor } from "../../services/api";
import { getDemoStore, demoProducts } from "../../data/demo/catalog";
import { isDemoMode, isDemoStoreId } from "../../data/demo/demoMode";
import { StorePageSkeleton } from "../../components/common/LoadingPatterns";
import { AsyncImage } from "../../components/common/AsyncImage";

export const Store: FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);
  const load = useCallback(async () => {
    const requestId = ++requestSequence.current;
    setIsLoading(true); setError(null);
    try {
      if (isDemoStoreId(id)) {
        if (!isDemoMode) { setStore(null); setError("Esta tienda solo existe en la vista de demostración."); return; }
        const demoStore = getDemoStore(id);
        if (!demoStore) { setStore(null); setError("La tienda demo no existe."); return; }
        if (requestId === requestSequence.current) {
          setStore(demoStore);
          setProducts(demoProducts.filter(product => product.store.id === demoStore.id));
        }
        return;
      }
      const loadedStore = await marketplaceApi.store(id);
      const loadedProducts = await marketplaceApi.products({ storeId: loadedStore.id });
      if (requestId === requestSequence.current) { setStore(loadedStore); setProducts(loadedProducts); }
    }
    catch (requestError) { if (requestId === requestSequence.current) setError(userMessageFor(requestError)); }
    finally { if (requestId === requestSequence.current) setIsLoading(false); }
  }, [id]);
  useEffect(() => { void load(); return () => { requestSequence.current += 1; }; }, [load]);
  if (isLoading) return <StorePageSkeleton />;
  if (error || !store) return <div className="page-container flex min-h-80 flex-col items-center justify-center gap-3 text-center"><p role="alert" className="max-w-lg text-surface-700">{error || "Tienda no encontrada."}</p><button type="button" onClick={() => void load()} className="min-h-10 rounded-lg px-3 text-sm font-semibold text-primary-800 hover:bg-primary-50">Intentar de nuevo</button></div>;
  return <div className={`page-container page-section${isDemoStoreId(id) ? " demo-store-page" : ""}`}>
    {isDemoStoreId(id) && <div className="demo-notice mb-5" role="note"><span className="demo-notice__dot" /> Escaparate ficticio de demostración</div>}
    <section className={`relative mb-8 min-h-52 overflow-hidden rounded-3xl bg-surface-900 sm:min-h-64 lg:min-h-72${isDemoStoreId(id) ? " demo-store-hero" : ""}`}>
      {store.banner && <AsyncImage src={store.banner} alt="" fallbackSrc="/images/demo/category-market.svg" className="absolute inset-0 h-full w-full" imageClassName="object-cover opacity-60" />}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-surface-900/15 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5 flex items-end gap-4 sm:bottom-7 sm:left-7"><AsyncImage src={store.logo} alt="" className="h-16 w-16 shrink-0 rounded-2xl border-2 border-white bg-white shadow-md sm:h-20 sm:w-20" imageClassName="object-contain" fallbackSrc="/images/demo/category-market.svg" /><div className="min-w-0"><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/80">Tienda</p><h1 className="text-2xl font-bold text-white sm:text-3xl">{store.name}</h1></div></div>
    </section>
    <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-surface-600">{store.category && <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-surface-200">{store.category}</span>}{store.deliveryTime && <span className="inline-flex items-center gap-1"><Icon name="Clock3" size={15} />{store.deliveryTime}</span>}</div>
    <section><h2 className="section-heading mb-4">{isDemoStoreId(id) ? "Productos de demostración" : "Productos publicados"}</h2>{products.length ? <ProductGrid products={products.map(product => ({ ...product, store }))} /> : <div className="surface-card py-12 text-center text-surface-600"><Icon name="ShoppingBag" size={36} /><p className="mt-2 text-sm">{isDemoStoreId(id) ? "Este escaparate demo no tiene productos." : "Esta tienda aún no tiene productos activos."}</p></div>}</section>
  </div>;
};

export default Store;
