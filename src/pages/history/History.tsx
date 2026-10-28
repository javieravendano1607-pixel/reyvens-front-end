import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { commerceApi, type OrderListDto } from "../../services/commerce";
import { userMessageFor } from "../../services/api";
import { OrderListSkeleton } from "../../components/common/LoadingPatterns";

function orderStatusLabel(status: string): string {
  const labels: Record<string, string> = { pending: "Pendiente", accepted: "Aceptado", preparing: "Preparando", ready: "Listo", completed: "Completado", cancelled: "Cancelado", rejected: "Rechazado" };
  return labels[status] ?? status;
}

export const History: FC = () => {
  const [orders, setOrders] = useState<OrderListDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);
  const load = useCallback(async (requestedPage: number, append = false) => {
    const requestId = ++requestSequence.current;
    setIsLoading(true); setError(null);
    try {
      const result = await commerceApi.orders(requestedPage, 20);
      if (requestId === requestSequence.current) {
        setOrders(current => append ? [...current, ...result.data] : result.data);
        setPage(result.pagination.page);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (requestError) { if (requestId === requestSequence.current) setError(userMessageFor(requestError)); }
    finally { if (requestId === requestSequence.current) setIsLoading(false); }
  }, []);
  useEffect(() => { void load(1); return () => { requestSequence.current += 1; }; }, [load]);

  return <div className="page-container page-section">
    <div className="page-heading"><p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary-800">Tu cuenta</p><h1 className="page-title">Historial de compras</h1><p className="text-sm text-surface-600">Consulta el estado de tus pedidos.</p></div>
    {isLoading && !orders.length ? <OrderListSkeleton /> : error && !orders.length ? <div className="surface-card p-6 text-center"><p role="alert" className="text-sm text-surface-700">{error}</p><button type="button" onClick={() => void load(page)} className="mt-2 min-h-10 rounded-lg px-3 text-sm font-semibold text-primary-800 hover:bg-primary-50">Intentar de nuevo</button></div> : error ? <div className="mb-4 rounded-xl border border-surface-200 bg-white p-4"><p role="alert" className="text-sm text-surface-700">{error}</p><button type="button" onClick={() => void load(page)} className="mt-2 min-h-10 text-sm font-semibold text-primary-800 underline">Reintentar</button></div> : orders.length === 0 ? <div className="surface-card flex flex-col items-center p-10 text-center text-surface-600"><Icon name="ShoppingBag" size={36} /><h2 className="mt-3 font-semibold text-surface-900">Todavía no tienes pedidos</h2><p className="mt-1 text-sm">Tus compras aparecerán aquí.</p></div> : <div className="grid gap-3 md:grid-cols-2">{orders.map(order => <Link key={order.id} to={`/receipt/${order.id}`} className="surface-card group block p-4 transition-shadow hover:shadow-md sm:p-5"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs font-medium uppercase tracking-wide text-surface-500">Pedido</p><span className="font-semibold text-surface-900">#{order.id}</span></div><span className="rounded-full bg-surface-100 px-3 py-1 text-xs font-semibold text-surface-800">{orderStatusLabel(order.status)}</span></div><div className="mt-4 flex flex-wrap items-end justify-between gap-2"><span className="text-sm text-surface-600">{new Date(order.created_at).toLocaleString("es-CO")}</span><span className="text-lg font-bold text-surface-900">${Number(order.total).toLocaleString("es-CO")} <span className="text-xs font-medium">{order.currency}</span></span></div><span className="mt-4 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary-800">Ver estado y tiendas <Icon name="ChevronRight" size={16} /></span></Link>)}</div>}
    {page < totalPages && <div className="mt-5"><button type="button" disabled={isLoading} onClick={() => void load(page + 1, true)} className="min-h-12 w-full rounded-xl border border-surface-300 bg-white text-sm font-semibold text-surface-800 transition-colors hover:bg-surface-50 disabled:opacity-50">{isLoading ? "Cargando…" : "Cargar más pedidos"}</button></div>}
  </div>;
};

export default History;
