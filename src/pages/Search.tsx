import { FC, FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { ProductGrid } from "../components/common/ProductGrid";
import { useCatalogCategories, useCatalogProducts } from "../hooks/useCatalog";
import { demoSearchText, getDemoProduct } from "../data/demo/catalog";
import { isDemoMode, isDemoProductId } from "../data/demo/demoMode";
import { ProductGridSkeleton } from "../components/common/LoadingPatterns";
import { useRecentSearches } from "../hooks/useRecentSearches";

export const Search: FC = () => {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("relevance");
  const { products, isLoading, error, refresh } = useCatalogProducts();
  const { categories, isLoading: categoriesLoading } = useCatalogCategories();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();
  const navigate = useNavigate();
  const results = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("es-CO");
    if (!search) return [];
    const matched = products.filter(product => {
      const demoProduct = isDemoMode && isDemoProductId(product.id) ? getDemoProduct(product.id) : undefined;
      const text = demoProduct
        ? demoSearchText(demoProduct)
        : `${product.name} ${product.description} ${product.store.name !== "Tienda local" ? product.store.name : ""} ${categories.find(category => category.id === product.categoryId)?.name ?? ""}`;
      return text.toLocaleLowerCase("es-CO").includes(search) && (!categoryId || product.categoryId === categoryId);
    });
    if (sort === "price-asc") return matched.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return matched.sort((a, b) => b.price - a.price);
    if (sort === "rating") return matched.sort((a, b) => b.rating - a.rating);
    return matched;
  }, [query, products, categories, categoryId, sort]);
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = query.trim().replace(/\s+/g, " ");
    if (!normalized) return;
    setQuery(normalized);
    addRecentSearch(normalized);
  };

  return <div className="page-container page-section">
    <div className="page-heading"><p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary-800">Catálogo</p><h1 className="page-title">Buscar</h1></div>
    <form onSubmit={submitSearch} className="mb-7 flex items-center gap-2">
      <button type="button" onClick={() => navigate(-1)} aria-label="Volver" className="icon-control"><Icon name="ArrowLeft" size={20} /></button>
      <label className="relative block min-w-0 flex-1">
        <span className="sr-only">Buscar productos, tiendas o descripción</span>
        <input type="search" placeholder="Buscar productos…" value={query} onChange={event => setQuery(event.target.value)} className="min-h-12 w-full rounded-xl border border-surface-300 bg-white py-3 pl-11 pr-4 text-sm text-surface-900 placeholder:text-surface-500 focus-visible:border-primary-700" autoFocus />
        <Icon name="Search" size={18} className="absolute left-4 top-3.5 text-surface-500" />
      </label>
      <button type="submit" aria-label="Guardar búsqueda" className="icon-control" disabled={!query.trim()}><Icon name="ArrowRight" size={19} /></button>
    </form>
    {!query.trim() && recentSearches.length > 0 && <section className="mb-6 rounded-2xl border border-surface-200 bg-white p-4" aria-label="Búsquedas recientes">
      <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-sm font-semibold text-surface-900">Búsquedas recientes</h2><button type="button" onClick={clearRecentSearches} className="min-h-9 rounded-lg px-2 text-xs font-semibold text-surface-600 underline underline-offset-2 hover:text-primary-800">Limpiar historial</button></div>
      <div className="flex flex-wrap gap-2">{recentSearches.map(search => <button key={search} type="button" onClick={() => setQuery(search)} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-surface-200 bg-surface-50 px-3 text-sm text-surface-700 transition-colors hover:border-primary-300 hover:text-surface-900"><Icon name="Clock3" size={14} />{search}</button>)}</div>
    </section>}
    {isDemoMode && <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-surface-200 bg-white p-4 sm:flex-row sm:items-center"><p className="mr-auto text-sm font-semibold text-surface-800">Filtros del catálogo demo</p><label className="flex min-h-11 items-center gap-2 rounded-xl border border-surface-200 px-3 text-sm text-surface-700"><span>Categoría</span><select aria-label="Filtrar por categoría" disabled={categoriesLoading} value={categoryId} onChange={event => setCategoryId(event.target.value)} className="min-h-10 max-w-[190px] bg-transparent font-medium text-surface-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-700 disabled:opacity-60"><option value="">{categoriesLoading ? "Cargando…" : "Todas"}</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="flex min-h-11 items-center gap-2 rounded-xl border border-surface-200 px-3 text-sm text-surface-700"><span>Ordenar</span><select aria-label="Ordenar resultados demo" value={sort} onChange={event => setSort(event.target.value)} className="min-h-10 bg-transparent font-medium text-surface-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-700"><option value="relevance">Relevancia</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option><option value="rating">Valoración demo</option></select></label></div>}
    {isLoading ? <ProductGridSkeleton count={6} label="Cargando catálogo para buscar" /> : error ? <div className="surface-card py-10 text-center"><p role="alert" className="text-sm text-surface-700">{error}</p><button type="button" onClick={() => void refresh()} className="mt-2 min-h-10 rounded-lg px-3 text-sm font-semibold text-primary-800 hover:bg-primary-50">Intentar de nuevo</button></div> : query.trim() ? <>
      <p className="mb-4 text-sm text-surface-600" aria-live="polite">{results.length} resultados en {isDemoMode ? "el catálogo de demostración" : "el catálogo disponible"} para “{query}”</p>
      {results.length ? <ProductGrid products={results} /> : <div className="surface-card py-12 text-center text-surface-600"><Icon name="Search" size={40} /><p className="mt-2 text-sm">No se encontraron productos.</p></div>}
    </> : <div className="surface-card py-10 text-center text-sm text-surface-600">{isDemoMode ? "Escribe para buscar en el catálogo de demostración." : "Escribe para buscar entre los productos publicados."}</div>}
  </div>;
};

export default Search;
