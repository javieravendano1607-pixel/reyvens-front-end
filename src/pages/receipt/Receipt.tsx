import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { Button } from "../../components/ui/Button";
import { commerceApi, type OrderDetailDto } from "../../services/commerce";
import { userMessageFor } from "../../services/api";
import { ReceiptSkeleton } from "../../components/common/LoadingPatterns";

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
  const requestSequence = useRef(0);
  const loadOrder = useCallback(async (showLoading: boolean) => {
    const requestId = ++requestSequence.current;
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const result = await commerceApi.order(id);
      if (requestId === requestSequence.current) setOrder(result);
    }
    catch (requestError) { if (requestId === requestSequence.current) setError(userMessageFor(requestError)); }
    finally { if (requestId === requestSequence.current) setIsLoading(false); }
  }, [id]);
  useEffect(() => { void loadOrder(true); return () => { requestSequence.current += 1; }; }, [loadOrder]);
  useEffect(() => {
    if (!order || order.payment?.status !== "pending" || pollCount >= 12) return;
    let active = true;
    const timer = window.setTimeout(() => { setIsRefreshing(true); void loadOrder(false).finally(() => { if (active) { setPollCount(count => count + 1); setIsRefreshing(false); } }); }, 5000);
    return () => { active = false; window.clearTimeout(timer); };
  }, [order, pollCount, loadOrder]);
  if (isLoading) return <ReceiptSkeleton />;
  if (!order) return <div className="flex min-h-80 flex-col items-center justify-center gap-3 px-4 text-center"><p role="alert" className="text-surface-600">{error || "Pedido no encontrado."}</p><Button onClick={() => void loadOrder(true)}>Intentar de nuevo</Button></div>;
  const paymentStatus = order.payment?.status ?? "pending";
  return <div className="page-container page-section">
    {error && <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-surface-200 bg-white p-3"><p role="alert" className="text-sm text-surface-700">No se pudo actualizar el pedido: {error}. Mostramos la última información cargada.</p><button type="button" onClick={() => void loadOrder(false)} className="min-h-10 px-2 text-sm font-semibold text-primary-800 underline">Reintentar</button></div>}
    <div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary-800">Detalle de compra</p><h1 className="page-title">Pedido #{order.id}</h1></div><button type="button" aria-label="Actualizar estado" disabled={isRefreshing} onClick={() => { setIsRefreshing(true); void loadOrder(false).finally(() => setIsRefreshing(false)); }} className="icon-control" title="Actualizar estado"><Icon name="RefreshCw" size={18} /></button></div>
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.55fr)]"><div className="space-y-4"><section className="surface-card p-4 sm:p-5"><h2 className="font-semibold text-surface-900">Pago: {statusText(paymentStatus)}</h2>{paymentStatus === "pending" && <p role="status" className="mt-2 flex gap-2 text-sm leading-6 text-surface-700"><Icon name="Clock3" size={17} className="mt-0.5 shrink-0" />Esperando confirmación del backend. Volver desde Wompi no confirma el pago.</p>}{paymentStatus === "paid" && <p className="mt-2 flex gap-2 text-sm text-surface-800"><Icon name="CircleCheck" size={17} className="shrink-0" />El backend confirmó el pago.</p>}{paymentStatus === "failed" && <p className="mt-2 flex gap-2 text-sm text-primary-900"><Icon name="CircleX" size={17} className="shrink-0" />El pago no fue aprobado. Contacta soporte antes de volver a intentar.</p>}{paymentStatus === "pending" && pollCount >= 12 && <p className="mt-2 text-xs text-surface-600">La confirmación puede tardar. Puedes actualizar este pedido más tarde desde Historial.</p>}</section>
      <section className="surface-card p-4 sm:p-5"><h2 className="mb-2 font-semibold text-surface-900">Tiendas del pedido</h2>{order.stores.map(store => <div key={store.id} className="border-b border-surface-200 py-4 last:border-0"><div className="flex flex-wrap justify-between gap-2"><span className="font-semibold text-surface-900">{store.store_name_snapshot}</span><span className="rounded-full bg-surface-100 px-2.5 py-1 text-xs font-medium text-surface-700">{statusText(store.status)}</span></div>{store.items.map(item => <div key={item.id} className="mt-3 flex justify-between gap-3 text-sm"><span className="min-w-0 text-surface-700">{item.product_name_snapshot}{item.variant_sku_snapshot ? ` · ${item.variant_sku_snapshot}` : ""} × {item.quantity}</span><span className="shrink-0 font-medium text-surface-900">${Number(item.line_total).toLocaleString("es-CO")}</span></div>)}</div>)}</section></div>
      <div className="space-y-4"><section className="surface-card p-4 text-sm sm:p-5"><h2 className="mb-4 font-semibold text-surface-900">Resumen</h2><div className="flex flex-wrap justify-between gap-2"><span className="text-surface-600">Fecha</span><span className="text-right">{new Date(order.created_at).toLocaleString("es-CO")}</span></div><div className="mt-3 flex justify-between gap-3"><span className="shrink-0 text-surface-600">Entrega</span><span className="text-right text-surface-800">{order.shipping_address}, {order.shipping_neighborhood}, {order.shipping_city}</span></div><div className="mt-4 space-y-2 border-t border-surface-200 pt-4"><div className="flex justify-between"><span className="text-surface-600">Subtotal</span><span>${Number(order.subtotal).toLocaleString("es-CO")}</span></div><div className="flex justify-between"><span className="text-surface-600">Entrega</span><span>${Number(order.delivery_total).toLocaleString("es-CO")}</span></div><div className="flex justify-between border-t border-surface-200 pt-3 font-bold text-surface-900"><span>Total confirmado por servidor</span><span className="text-right">${Number(order.total).toLocaleString("es-CO")} {order.currency}</span></div></div></section><Link to="/history" className="flex min-h-12 items-center justify-center rounded-xl border border-surface-300 bg-white text-sm font-semibold text-surface-800 hover:bg-surface-50">Volver al historial</Link></div>
    </div></div>;
};

export default Receipt;
