import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { ProductCard } from "../components/common/ProductCard";
import { useCatalogProducts } from "../hooks/useCatalog";

export const Search: FC = () => {
  const [query, setQuery] = useState("");
  const { products, isLoading, error, refresh } = useCatalogProducts();
  const navigate = useNavigate();
  const results = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("es-CO");
    if (!search) return [];
    return products.filter(product => `${product.name} ${product.description} ${product.store.name}`.toLocaleLowerCase("es-CO").includes(search));
  }, [query, products]);
  return <div className="min-h-screen bg-surface-50 pb-20"><div className="bg-white px-4 py-3"><div className="flex items-center gap-2"><button onClick={() => navigate(-1)} className="p-1 text-surface-600"><Icon name="ArrowLeft" size={20} /></button><div className="relative flex-1"><input type="search" placeholder="Buscar productos…" value={query} onChange={event => setQuery(event.target.value)} className="w-full rounded-full bg-surface-100 px-4 py-2 pl-10 text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500" autoFocus /><Icon name="Search" size={18} color="#9CA3AF" className="absolute left-3 top-2.5" /></div></div></div>
    <div className="px-4 py-3">{isLoading ? <p role="status" className="py-8 text-center text-sm text-surface-500">Cargando catálogo para buscar…</p> : error ? <div className="py-8 text-center"><p role="alert" className="text-sm text-surface-600">{error}</p><button onClick={() => void refresh()} className="mt-2 text-sm text-primary-600">Intentar de nuevo</button></div> : query.trim() ? <><p className="mb-2 text-sm text-surface-600">{results.length} resultados en el catálogo disponible para “{query}”</p>{results.length ? <div className="grid grid-cols-2 gap-3">{results.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="py-12 text-center text-surface-500"><Icon name="Search" size={48} color="#D1D5DB" /><p className="mt-2 text-sm">No se encontraron productos.</p></div>}</> : <div className="py-10 text-center text-sm text-surface-500">Escribe para buscar entre los productos publicados.</div>}</div>
  </div>;
};

export default Search;
