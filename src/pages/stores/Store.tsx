import { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { ProductCard } from "../../components/common/ProductCard";
import type { StoreInfo, Product } from "../../data/types";
import { marketplaceApi } from "../../services/marketplace";
import { userMessageFor } from "../../services/api";

export const Store: FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    setIsLoading(true); setError(null);
    try { const loadedStore = await marketplaceApi.store(id); setStore(loadedStore); setProducts(await marketplaceApi.products({ storeId: loadedStore.id })); }
    catch (requestError) { setError(userMessageFor(requestError)); }
    finally { setIsLoading(false); }
  }, [id]);
  useEffect(() => { void load(); }, [load]);
  if (isLoading) return <p role="status" className="p-8 text-center text-sm text-surface-500">Cargando tienda…</p>;
  if (error || !store) return <div className="flex min-h-80 flex-col items-center justify-center gap-3 px-4 text-center"><p role="alert" className="text-surface-600">{error || "Tienda no encontrada."}</p><button onClick={() => void load()} className="text-sm text-primary-600">Intentar de nuevo</button></div>;
  return <div className="min-h-screen bg-surface-50 pb-20"><div className="relative h-36 w-full" style={store.banner ? { backgroundImage: `url(${store.banner})`, backgroundSize: "cover", backgroundPosition: "center" } : { backgroundColor: "#f3f4f6" }}><div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" /><div className="absolute bottom-3 left-4 flex items-end gap-3"><img src={store.logo} alt="" className="h-14 w-14 rounded-2xl border-2 border-white bg-white object-contain" /><h1 className="text-xl font-bold text-white">{store.name}</h1></div></div><div className="px-4 py-4"><p className="text-sm text-surface-600">{store.category || store.deliveryTime || "Información de tienda"}</p>{products.length ? <><h2 className="mb-3 mt-4 text-sm font-bold text-surface-900">Productos publicados</h2><div className="grid grid-cols-2 gap-3">{products.map(product => <ProductCard key={product.id} product={{ ...product, store }} />)}</div></> : <div className="py-12 text-center text-sm text-surface-500"><Icon name="ShoppingBag" size={36} /><p className="mt-2">Esta tienda aún no tiene productos activos.</p></div>}</div></div>;
};

export default Store;
