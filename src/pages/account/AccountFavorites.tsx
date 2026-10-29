import { useState, type FC } from "react";
import { Link } from "react-router-dom";
import { AsyncImage } from "../../components/common/AsyncImage";
import { Icon } from "../../components/ui/Icon";
import { useFavorites } from "../../contexts/FavoritesContext";
import { userMessageFor } from "../../services/api";

export const AccountFavorites: FC = () => {
  const { favorites, favoriteIds, isLoading, error, pendingIds, refresh, setFavorite } = useFavorites();
  const [actionError, setActionError] = useState("");
  return <div className="page-container page-section mx-auto max-w-5xl">
    <nav aria-label="Ruta de navegación" className="mb-6 flex items-center gap-2 text-xs font-medium text-surface-500">
      <Link to="/account" className="rounded-sm hover:text-surface-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">Mi cuenta</Link>
      <Icon name="ChevronRight" size={14} /><span aria-current="page" className="text-surface-800">Mis favoritos</span>
    </nav>
    <header className="mb-6">
      <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-primary-800">Tu selección</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">Mis favoritos</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-surface-600">Productos que guardaste para volver a encontrarlos.</p>
    </header>
    {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4" role="alert"><p className="text-sm font-medium text-red-800">{error}</p><button type="button" onClick={() => void refresh()} className="mt-2 min-h-10 rounded-lg px-2 text-sm font-semibold text-red-800 underline underline-offset-2">Intentar de nuevo</button></div>}
    {actionError && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</p>}
    {isLoading && favorites.length === 0 ? <div role="status" className="surface-card flex min-h-48 items-center justify-center gap-3 text-sm text-surface-600"><span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-surface-300 border-t-primary-700 motion-reduce:animate-none" />Cargando tus favoritos…</div>
      : !error && favorites.length === 0 ? <div className="surface-card flex min-h-64 flex-col items-center justify-center px-5 text-center">
        <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-800"><Icon name="Heart" size={25} /></span>
        <h2 className="mt-4 text-lg font-semibold text-surface-900">Aún no tienes favoritos</h2>
        <p className="mt-1 max-w-sm text-sm leading-6 text-surface-600">Explora el catálogo y guarda los productos que quieras consultar después.</p>
        <Link to="/categories" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary-700 px-5 text-sm font-semibold text-white hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">Explorar catálogo <Icon name="ArrowRight" size={16} /></Link>
      </div> : favorites.length > 0 && <>
        <p className="mb-3 text-xs text-surface-500">También verás favoritos que ya no estén disponibles o que fueron eliminados, con la información que aún esté disponible.</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {favorites.map(item => {
            const productName = item.name ?? "Producto ya no disponible";
            const content = <>
              <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-100">
                {item.image_url ? <AsyncImage src={item.image_url} alt={productName} className="h-full w-full" imageClassName="object-cover" fallbackSrc="" /> : <span role="img" aria-label="Fotografía no disponible" className="flex h-full w-full items-center justify-center text-surface-400"><Icon name="ImageOff" size={22} /></span>}
              </div>
              <div className="min-w-0 py-1">
                <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-surface-900">{productName}</h2>
                {item.base_price !== null && <p className="mt-2 text-base font-bold text-surface-900">${Number(item.base_price).toLocaleString("es-CO")} COP</p>}
                {item.availability === "unavailable" && <p className="mt-2 inline-flex rounded-full bg-surface-100 px-2.5 py-1 text-xs font-semibold text-surface-700">{item.status === "active" && item.inventory_tracking_enabled && Number(item.stock_quantity) <= 0 ? "Sin unidades" : "No disponible"}</p>}
              </div>
            </>;
            return <li key={item.id} className="relative min-w-0 overflow-hidden rounded-2xl border border-surface-200 bg-white transition-colors hover:border-surface-300">
              {Boolean(item.is_navigable) && item.name
                ? <Link to={`/product/${encodeURIComponent(item.slug || item.id)}`} className="flex min-h-32 min-w-0 gap-4 p-3 pr-14 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">{content}</Link>
                : <div className="flex min-h-32 min-w-0 gap-4 p-3 pr-14">{content}</div>}
              <button type="button" disabled={!favoriteIds.has(item.id) || pendingIds.has(item.id)} aria-label={`Quitar ${productName} de favoritos`} title="Quitar de favoritos" onClick={() => { setActionError(""); void setFavorite(item.id, false).catch(error => setActionError(userMessageFor(error))); }} className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-surface-200 bg-white text-primary-800 shadow-sm transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:opacity-50"><Icon name="Heart" size={18} /></button>
            </li>;
          })}
        </ul>
      </>}
  </div>;
};

export default AccountFavorites;
