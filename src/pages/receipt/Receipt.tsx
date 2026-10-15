import { FC, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { Button } from "../../components/ui/Button";
import { commerceApi, type OrderDetailDto } from "../../services/commerce";
import { userMessageFor } from "../../services/api";

function statusText(status: string): string {
  const labels: Record<string, string> = { pending: "Pendiente", paid: "Pagado", failed: "Fallido", refund_pending: "Reembolso en proceso", refunded: "Reembolsado", accepted: "Aceptado", preparing: "Preparando", ready: "Listo", completed: "Completado", cancelled: "Cancelado", rejected: "Rechazado" };
  return labels[status] ?? status;
}

export const Receipt: FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const loadOrder = useCallback(async (showLoading: boolean) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try { setOrder(await commerceApi.order(id)); }
    catch (requestError) { setError(userMessageFor(requestError)); }
    finally { if (showLoading) setIsLoading(false); }
  }, [id]);
  useEffect(() => { void loadOrder(true); }, [loadOrder]);
  useEffect(() => {
    if (!order || order.payment?.status !== "pending" || pollCount >= 12) return;
    const timer = window.setTimeout(() => { setIsRefreshing(true); void loadOrder(false).finally(() => { setPollCount(count => count + 1); setIsRefreshing(false); }); }, 5000);
    return () => window.clearTimeout(timer);
  }, [order, pollCount, loadOrder]);
  if (isLoading) return <div role="status" className="p-8 text-center text-sm text-surface-500">Cargando pedido…</div>;
  if (error || !order) return <div className="flex min-h-80 flex-col items-center justify-center gap-3 px-4 text-center"><p role="alert" className="text-surface-600">{error || "Pedido no encontrado."}</p><Button onClick={() => void loadOrder(true)}>Intentar de nuevo</Button></div>;
  const paymentStatus = order.payment?.status ?? "pending";
  return <div className="min-h-screen bg-surface-100 pb-20"><div className="bg-white px-4 py-3"><div className="flex items-center justify-between"><h1 className="text-lg font-bold text-surface-900">Pedido #{order.id}</h1><button aria-label="Actualizar estado" disabled={isRefreshing} onClick={() => { setIsRefreshing(true); void loadOrder(false).finally(() => setIsRefreshing(false)); }} className="p-2 text-surface-600"><Icon name="RefreshCw" size={18} /></button></div></div>
    <div className="space-y-3 px-4 py-3"><section className="rounded-2xl bg-white p-4"><h2 className="font-semibold">Pago: {statusText(paymentStatus)}</h2>{paymentStatus === "pending" && <p role="status" className="mt-2 text-sm text-surface-600">Esperando confirmación del backend. Volver desde Wompi no confirma el pago.</p>}{paymentStatus === "paid" && <p className="mt-2 text-sm text-green-700">El backend confirmó el pago.</p>}{paymentStatus === "failed" && <p className="mt-2 text-sm text-primary-700">El pago no fue aprobado. Contacta soporte antes de volver a intentar.</p>}{paymentStatus === "pending" && pollCount >= 12 && <p className="mt-2 text-xs text-surface-500">La confirmación puede tardar. Puedes actualizar este pedido más tarde desde Historial.</p>}</section>
      <section className="rounded-2xl bg-white p-4"><h2 className="mb-3 font-semibold">Tiendas del pedido</h2>{order.stores.map(store => <div key={store.id} className="border-b border-surface-100 py-3 last:border-0"><div className="flex justify-between gap-2"><span className="font-medium">{store.store_name_snapshot}</span><span className="text-xs text-surface-600">{statusText(store.status)}</span></div>{store.items.map(item => <div key={item.id} className="mt-2 flex justify-between gap-3 text-sm"><span>{item.product_name_snapshot}{item.variant_sku_snapshot ? ` · ${item.variant_sku_snapshot}` : ""} × {item.quantity}</span><span>${Number(item.line_total).toLocaleString("es-CO")}</span></div>)}</div>)}</section>
      <section className="rounded-2xl bg-white p-4 font-mono text-sm"><div className="flex justify-between"><span className="text-surface-600">Fecha</span><span>{new Date(order.created_at).toLocaleString("es-CO")}</span></div><div className="mt-2 flex justify-between gap-3"><span className="text-surface-600">Entrega</span><span className="text-right">{order.shipping_address}, {order.shipping_neighborhood}, {order.shipping_city}</span></div><div className="mt-3 border-t border-surface-200 pt-3"><div className="flex justify-between"><span>Subtotal</span><span>${Number(order.subtotal).toLocaleString("es-CO")}</span></div><div className="flex justify-between"><span>Entrega</span><span>${Number(order.delivery_total).toLocaleString("es-CO")}</span></div><div className="flex justify-between border-t border-surface-300 pt-2 font-bold"><span>Total del servidor</span><span>${Number(order.total).toLocaleString("es-CO")} {order.currency}</span></div></div></section><Link to="/history" className="block rounded-xl border border-surface-300 bg-white py-3 text-center text-sm font-medium">Volver al historial</Link>
    </div></div>;
};

export default Receipt;
