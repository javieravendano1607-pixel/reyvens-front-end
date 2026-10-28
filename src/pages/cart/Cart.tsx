import { FC, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { Button } from "../../components/ui/Button";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { useCart, type CartItem } from "../../contexts/CartContext";
import { commerceApi, type AddressDto, type CheckoutOrderDto, type CreateAddressInput } from "../../services/commerce";
import { userMessageFor } from "../../services/api";
import { CartSkeleton } from "../../components/common/LoadingPatterns";
import { AsyncImage } from "../../components/common/AsyncImage";
import { Skeleton } from "../../components/ui/Skeleton";

const emptyAddress: CreateAddressInput = { recipientName: "", recipientPhone: "", city: "", neighborhood: "", address: "", reference: "" };

export const Cart: FC = () => {
  const { items, removeItem, updateQuantity, subtotal, isLoading, isMutating, error: cartError, refresh } = useCart();
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [creatingAddress, setCreatingAddress] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutOrder, setCheckoutOrder] = useState<CheckoutOrderDto | null>(null);

  const loadAddresses = useCallback(async () => {
    setAddressesLoading(true);
    setAddressesError(null);
    try {
      const list = await commerceApi.addresses();
      setAddresses(list);
      setSelectedAddressId(current => current || list.find(address => address.isDefault)?.id || list[0]?.id || "");
    } catch (requestError) { setAddressesError(userMessageFor(requestError)); }
    finally { setAddressesLoading(false); }
  }, []);
  useEffect(() => { void loadAddresses(); }, [loadAddresses]);

  const groups = useMemo(() => {
    const result = new Map<string, { store: CartItem["store"]; items: typeof items }>();
    for (const item of items) {
      const group = result.get(item.store.id) ?? { store: item.store, items: [] };
      group.items.push(item);
      result.set(item.store.id, group);
    }
    return Array.from(result.values());
  }, [items]);
  const selectedAddress = addresses.find(address => address.id === selectedAddressId);

  const createAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setCreatingAddress(true); setError(null);
    try {
      const address = await commerceApi.createAddress({ ...addressForm, isDefault: addresses.length === 0 });
      setAddresses(current => [...current, address]);
      setSelectedAddressId(address.id);
      setAddressForm(emptyAddress);
    } catch (requestError) { setError(userMessageFor(requestError)); }
    finally { setCreatingAddress(false); }
  };

  const openCheckout = async (order: CheckoutOrderDto) => {
    setIsCheckingOut(true); setError(null);
    try {
      const intent = await commerceApi.paymentIntent(order.payment.id);
      const checkoutUrl = new URL(intent.checkoutUrl);
      checkoutUrl.searchParams.set("public-key", intent.publicKey);
      checkoutUrl.searchParams.set("currency", intent.currency);
      checkoutUrl.searchParams.set("amount-in-cents", String(intent.amountInCents));
      checkoutUrl.searchParams.set("reference", intent.reference);
      checkoutUrl.searchParams.set("signature:integrity", intent.integritySignature);
      checkoutUrl.searchParams.set("redirect-url", `${window.location.origin}/receipt/${encodeURIComponent(order.id)}`);
      window.location.assign(checkoutUrl.toString());
    } catch (requestError) { setError(userMessageFor(requestError)); }
    finally { setIsCheckingOut(false); }
  };

  const checkout = async () => {
    if (!selectedAddressId || items.length === 0) return;
    setIsCheckingOut(true); setError(null); setCheckoutOrder(null);
    try {
      const order = await commerceApi.checkout(selectedAddressId);
      setCheckoutOrder(order);
      await refresh();
      await openCheckout(order);
    } catch (requestError) { setError(userMessageFor(requestError)); }
    finally { setIsCheckingOut(false); }
  };

  const busy = isCheckingOut || isMutating;

  return (
    <div className="page-container page-section pb-8">
      <div className="page-heading"><p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary-800">Tu compra</p><h1 className="page-title">Carrito</h1><p className="text-sm text-surface-600">Revisa los artículos antes de continuar.</p></div>
      {isLoading ? <CartSkeleton /> : cartError && items.length === 0 ? (
        <div className="surface-card p-6 text-center"><p role="alert" className="text-sm text-surface-700">{cartError}</p><button type="button" onClick={() => void refresh().catch(() => undefined)} className="mt-2 min-h-10 rounded-lg px-3 text-sm font-semibold text-primary-800 hover:bg-primary-50">Reintentar carga del carrito</button></div>
      ) : items.length === 0 ? (
        <div className="surface-card flex flex-col items-center px-5 py-16 text-center text-surface-600"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-100"><Icon name="ShoppingCart" size={28} /></span><h2 className="mt-4 font-semibold text-surface-900">Tu carrito está vacío</h2><p className="mt-1 text-sm">Explora el catálogo para encontrar productos.</p><Link to="/"><Button variant="primary" className="mt-5" leftIcon="ShoppingBag">Explorar productos</Button></Link></div>
      ) : <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.38fr)] lg:gap-8">
      <div className="space-y-4">
        {groups.map(group => <section key={group.store.id} className="rounded-2xl bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center gap-2 border-b border-surface-100 pb-3"><AsyncImage src={group.store.logo} alt="" className="h-8 w-8 shrink-0 rounded-full" fallbackSrc="/images/demo/category-market.svg" /><span className="font-semibold text-surface-900">{group.store.name}</span></div>
          {group.items.map(item => <div key={item.id} className="flex min-w-0 items-center gap-3 border-b border-surface-100 py-4 last:border-0 sm:gap-4">
            <AsyncImage src={item.image} alt={item.name} className="h-20 w-20 shrink-0 rounded-xl bg-surface-100 sm:h-24 sm:w-24" />
            <div className="min-w-0 flex-1"><h3 className="font-semibold text-surface-900 line-clamp-2">{item.name}</h3>{item.size && <span className="mt-1 block text-xs text-surface-600">Variante: {item.size}</span>}<div className="mt-1 text-sm font-bold text-surface-900">${item.price.toLocaleString("es-CO")}</div>{!item.isAvailable && <p className="mt-1 text-xs font-medium text-primary-800">{item.availabilityMessage || "No disponible"}</p>}</div>
            <div className="flex shrink-0 flex-col items-end gap-2"><button type="button" disabled={busy} onClick={() => void removeItem(item.id).catch(() => undefined)} className="icon-control text-surface-500 hover:text-primary-800" aria-label={`Eliminar ${item.name}`}><Icon name="Trash2" size={17} /></button><div className="flex items-center gap-1"><button type="button" disabled={busy || item.quantity <= 1} onClick={() => void updateQuantity(item.id, item.quantity - 1).catch(() => undefined)} className="icon-control border border-surface-300 bg-white disabled:opacity-40" aria-label={`Reducir cantidad de ${item.name}`}><Icon name="Minus" size={15} /></button><span className="w-7 text-center text-sm font-semibold" aria-label={`Cantidad: ${item.quantity}`}>{item.quantity}</span><button type="button" disabled={busy || (item.inventoryTrackingEnabled && item.stockQuantity !== null && item.quantity >= item.stockQuantity)} onClick={() => void updateQuantity(item.id, item.quantity + 1).catch(() => undefined)} className="icon-control border border-surface-300 bg-white disabled:opacity-40" aria-label={`Aumentar cantidad de ${item.name}`}><Icon name="Plus" size={15} /></button></div></div>
          </div>)}
        </section>)}
      </div>

      {items.length > 0 && <>
        <aside className="surface-card mt-4 p-4 lg:sticky lg:top-28 lg:mt-0 lg:p-5"><h2 className="text-lg font-bold text-surface-900">Resumen</h2><div className="mt-4 flex items-center justify-between text-sm"><span className="text-surface-600">Subtotal actual</span><span className="font-semibold text-surface-900">${subtotal.toLocaleString("es-CO")}</span></div><p className="mt-3 text-xs leading-5 text-surface-600">El backend vuelve a validar precios y disponibilidad durante el checkout. El total definitivo se confirma en el servidor.</p>
          <button type="button" onClick={() => setShowAddressSheet(true)} className="mt-4 flex min-h-16 w-full items-center justify-between gap-2 rounded-xl border border-surface-200 bg-surface-50 p-3 text-left hover:bg-white"><span className="flex min-w-0 items-center gap-3"><Icon name="MapPin" size={18} className="shrink-0 text-primary-800" /><span className="min-w-0"><span className="block text-xs text-surface-600">Dirección de entrega</span><span className="mt-0.5 block truncate text-sm font-medium text-surface-900">{selectedAddress ? `${selectedAddress.address}, ${selectedAddress.neighborhood}, ${selectedAddress.city}` : "Selecciona una dirección"}</span></span></span><Icon name="ChevronRight" size={17} className="shrink-0 text-surface-500" /></button>
          <Button variant="primary" size="lg" fullWidth className="mt-4" leftIcon="CreditCard" disabled={busy || !selectedAddressId || items.some(item => !item.isAvailable)} onClick={() => void checkout()}>{busy ? "Procesando…" : "Continuar a Wompi"}</Button>
        </aside>
      </>}
      {(error || cartError) && <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-primary-200 bg-primary-50 p-3 text-sm text-primary-900 lg:col-span-2"><p role="alert">{error || cartError}</p>{cartError && <button type="button" onClick={() => void refresh().catch(() => undefined)} className="min-h-10 shrink-0 rounded-lg px-2 font-semibold underline">Actualizar carrito</button>}</div>}
      {checkoutOrder && error && <div className="mt-4 rounded-xl border border-surface-200 bg-white p-4 text-sm lg:col-span-2"><p>La orden {checkoutOrder.id} ya se creó; el pago sigue pendiente.</p><button type="button" onClick={() => void openCheckout(checkoutOrder)} disabled={busy} className="mt-2 min-h-10 rounded-lg px-2 font-semibold text-primary-800 hover:bg-primary-50">Reintentar apertura de Wompi</button><Link to={`/receipt/${checkoutOrder.id}`} className="ml-3 text-primary-800 underline">Ver pedido</Link></div>}
      </div>}

      <BottomSheet isOpen={showAddressSheet} onClose={() => setShowAddressSheet(false)} height="h-auto">
        <div className="max-h-[80vh] space-y-4 overflow-y-auto"><h3 className="text-center text-lg font-bold">Dirección de entrega</h3>
          {addressesLoading ? <div role="status" aria-label="Cargando direcciones" aria-busy="true" className="space-y-3"><Skeleton className="h-16 rounded-xl" /><Skeleton className="h-16 rounded-xl" /></div> : addressesError ? <div className="rounded-xl border border-surface-200 bg-surface-50 p-3"><p role="alert" className="text-sm text-surface-700">{addressesError}</p><button type="button" onClick={() => void loadAddresses()} className="mt-2 min-h-10 text-sm font-semibold text-primary-800 underline">Reintentar direcciones</button></div> : addresses.map(address => <label key={address.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-surface-200 p-3"><input type="radio" name="deliveryAddress" checked={selectedAddressId === address.id} onChange={() => setSelectedAddressId(address.id)} /><span className="text-sm"><strong>{address.recipientName}{address.isDefault ? " · Principal" : ""}</strong><br />{address.address}<br />{address.neighborhood}, {address.city}<br /><span className="text-xs text-surface-500">{address.recipientPhone}{address.reference ? ` · ${address.reference}` : ""}</span></span></label>)}
          {!addressesLoading && !addressesError && !addresses.length && <p className="text-sm text-surface-500">Aún no tienes direcciones guardadas.</p>}
          <details className="rounded-xl bg-surface-50 p-3"><summary className="cursor-pointer text-sm font-medium">Agregar dirección</summary><form onSubmit={createAddress} className="mt-3 space-y-2">
            {([ ["recipientName", "Nombre de quien recibe"], ["recipientPhone", "Teléfono"], ["city", "Ciudad"], ["neighborhood", "Barrio"], ["address", "Dirección"], ["reference", "Referencia (opcional)"] ] as const).map(([key, label]) => <input key={key} aria-label={label} required={key !== "reference"} maxLength={key === "address" || key === "reference" ? 500 : 150} value={addressForm[key] || ""} onChange={event => setAddressForm(current => ({ ...current, [key]: event.target.value }))} placeholder={label} className="min-h-11 w-full rounded-xl border border-surface-300 bg-white px-3 py-2 text-sm focus-visible:border-primary-700" />)}
            <Button type="submit" fullWidth disabled={creatingAddress}>{creatingAddress ? "Guardando…" : "Guardar dirección"}</Button>
          </form></details>
          <Button variant="primary" fullWidth disabled={!selectedAddressId} onClick={() => setShowAddressSheet(false)}>Usar esta dirección</Button>
        </div>
      </BottomSheet>
    </div>
  );
};

export default Cart;
