import { FC, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { commerceApi, type OrderListDto } from "../../services/commerce";
import { userMessageFor } from "../../services/api";

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
  const load = useCallback(async (requestedPage: number, append = false) => {
    setIsLoading(true); setError(null);
    try {
      const result = await commerceApi.orders(requestedPage, 20);
      setOrders(current => append ? [...current, ...result.data] : result.data);
      setPage(result.pagination.page);
      setTotalPages(result.pagination.totalPages);
    } catch (requestError) { setError(userMessageFor(requestError)); }
    finally { setIsLoading(false); }
  }, []);
  useEffect(() => { void load(1); }, [load]);

  return <div className="min-h-screen bg-surface-50 pb-20"><div className="bg-white px-4 py-3"><h1 className="text-lg font-bold text-surface-900">Historial de compras</h1></div>
    {error ? <div className="p-6 text-center"><p role="alert" className="text-sm text-surface-600">{error}</p><button onClick={() => void load(page)} className="mt-2 text-sm text-primary-600">Intentar de nuevo</button></div> : null}
    {isLoading && !orders.length ? <p role="status" className="p-8 text-center text-sm text-surface-500">Cargando pedidos…</p> : orders.length === 0 && !error ? <div className="p-8 text-center text-sm text-surface-500"><Icon name="ShoppingBag" size={36} /><p className="mt-2">Todavía no tienes pedidos.</p></div> : <div className="space-y-3 px-4 py-3">{orders.map(order => <Link key={order.id} to={`/receipt/${order.id}`} className="block rounded-xl bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="font-semibold text-surface-900">Pedido #{order.id}</span><span className="text-xs text-surface-600">{orderStatusLabel(order.status)}</span></div><div className="mt-2 flex items-center justify-between text-sm"><span className="text-surface-500">{new Date(order.created_at).toLocaleString("es-CO")}</span><span className="font-bold">${Number(order.total).toLocaleString("es-CO")} {order.currency}</span></div><span className="mt-2 inline-block text-xs text-primary-700">Ver estado y tiendas <Icon name="ChevronRight" size={12} /></span></Link>)}</div>}
    {page < totalPages && <div className="px-4 py-4"><button disabled={isLoading} onClick={() => void load(page + 1, true)} className="w-full rounded-xl border border-surface-300 bg-white py-3 text-sm font-medium disabled:opacity-50">{isLoading ? "Cargando…" : "Cargar más pedidos"}</button></div>}
  </div>;
};

export default History;
