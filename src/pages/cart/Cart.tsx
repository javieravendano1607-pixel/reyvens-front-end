import { FC, FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { Button } from "../../components/ui/Button";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { useCart, type CartItem } from "../../contexts/CartContext";
import { commerceApi, type AddressDto, type CheckoutOrderDto, type CreateAddressInput } from "../../services/commerce";
import { userMessageFor } from "../../services/api";

const emptyAddress: CreateAddressInput = { recipientName: "", recipientPhone: "", city: "", neighborhood: "", address: "", reference: "" };

export const Cart: FC = () => {
  const { items, removeItem, updateQuantity, subtotal, isLoading, isMutating, error: cartError, refresh } = useCart();
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [creatingAddress, setCreatingAddress] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutOrder, setCheckoutOrder] = useState<CheckoutOrderDto | null>(null);

  const loadAddresses = async () => {
    try {
      const list = await commerceApi.addresses();
      setAddresses(list);
      setSelectedAddressId(current => current || list.find(address => address.isDefault)?.id || list[0]?.id || "");
    } catch (requestError) { setError(userMessageFor(requestError)); }
  };
  useEffect(() => { void loadAddresses(); }, []);

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
    <div className="min-h-screen bg-surface-50 pb-24">
      <div className="bg-white px-4 py-3"><h1 className="text-lg font-bold text-surface-900">Carrito de compras</h1></div>
      {isLoading ? <p role="status" className="py-12 text-center text-sm text-surface-500">Cargando carrito…</p> : items.length === 0 ? (
        <div className="py-16 text-center text-surface-500"><Icon name="ShoppingCart" size={48} color="#D1D5DB" /><p className="mt-2 text-sm">Tu carrito está vacío</p><Link to="/"><Button variant="primary" className="mt-4" leftIcon="ShoppingBag">Explorar productos</Button></Link></div>
      ) : <div className="space-y-4 px-4">
        {groups.map(group => <section key={group.store.id} className="rounded-2xl bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-2"><img src={group.store.logo} alt="" className="h-6 w-6 rounded" /><span className="font-medium text-surface-900">{group.store.name}</span></div>
          {group.items.map(item => <div key={item.id} className="flex items-center gap-3 border-b border-surface-100 py-3 last:border-0">
            <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1"><h3 className="text-sm font-medium text-surface-900 line-clamp-1">{item.name}</h3>{item.size && <span className="text-xs text-surface-600">Variante: {item.size}</span>}<div className="text-sm font-bold">${item.price.toLocaleString("es-CO")}</div>{!item.isAvailable && <p className="text-xs text-primary-700">{item.availabilityMessage || "No disponible"}</p>}</div>
            <div className="flex flex-col items-end gap-1"><button disabled={busy} onClick={() => void removeItem(item.id).catch(() => undefined)} className="text-surface-400 hover:text-primary-600 disabled:opacity-50" aria-label={`Eliminar ${item.name}`}><Icon name="Trash2" size={16} /></button><div className="flex items-center gap-1"><button disabled={busy || item.quantity <= 1} onClick={() => void updateQuantity(item.id, item.quantity - 1).catch(() => undefined)} className="flex h-7 w-7 items-center justify-center rounded bg-surface-100 text-surface-600 disabled:opacity-40"><Icon name="Minus" size={12} /></button><span className="w-5 text-center text-xs">{item.quantity}</span><button disabled={busy || (item.inventoryTrackingEnabled && item.stockQuantity !== null && item.quantity >= item.stockQuantity)} onClick={() => void updateQuantity(item.id, item.quantity + 1).catch(() => undefined)} className="flex h-7 w-7 items-center justify-center rounded bg-surface-100 text-surface-600 disabled:opacity-40"><Icon name="Plus" size={12} /></button></div></div>
          </div>)}
        </section>)}
      </div>}

      {items.length > 0 && <>
        <div className="mt-4 px-4"><div className="rounded-2xl bg-white p-4 shadow-sm"><div className="flex items-center justify-between text-sm"><span className="text-surface-600">Subtotal actual del carrito</span><span>${subtotal.toLocaleString("es-CO")}</span></div><p className="mt-2 text-xs text-surface-500">El backend vuelve a validar precios y disponibilidad durante el checkout. No se calcula un total final en esta pantalla.</p></div></div>
        <button type="button" onClick={() => setShowAddressSheet(true)} className="mx-4 mt-3 flex w-[calc(100%-2rem)] items-center justify-between rounded-xl bg-white p-3 text-left shadow-sm"><div className="flex items-center gap-2"><Icon name="MapPin" size={16} color="#6B7280" /><div><p className="text-xs text-surface-600">Dirección de entrega</p><p className="text-sm font-medium">{selectedAddress ? `${selectedAddress.address}, ${selectedAddress.neighborhood}, ${selectedAddress.city}` : "Selecciona o agrega una dirección"}</p></div></div><Icon name="ChevronRight" size={16} color="#9CA3AF" /></button>
        <div className="mx-auto mt-3 max-w-sm px-4"><Button variant="gold" size="lg" fullWidth leftIcon="CreditCard" disabled={busy || !selectedAddressId || items.some(item => !item.isAvailable)} onClick={() => void checkout()}>{busy ? "Procesando…" : "CONTINUAR A WOMPI"}</Button></div>
      </>}
      {(error || cartError) && <div className="mx-4 mt-3 flex items-center justify-between gap-2 text-sm text-primary-700"><p role="alert">{error || cartError}</p>{cartError && <button onClick={() => void refresh().catch(() => undefined)} className="shrink-0 underline">Actualizar carrito</button>}</div>}
      {checkoutOrder && error && <div className="mx-4 mt-3 rounded-xl bg-white p-3 text-sm"><p>La order {checkoutOrder.id} ya se creó; el pago sigue pendiente.</p><button onClick={() => void openCheckout(checkoutOrder)} disabled={busy} className="mt-2 font-medium text-primary-700">Reintentar apertura de Wompi</button><Link to={`/receipt/${checkoutOrder.id}`} className="ml-3 text-primary-700 underline">Ver pedido</Link></div>}

      <BottomSheet isOpen={showAddressSheet} onClose={() => setShowAddressSheet(false)} height="h-auto">
        <div className="max-h-[80vh] space-y-4 overflow-y-auto"><h3 className="text-center text-lg font-bold">Dirección de entrega</h3>
          {addresses.map(address => <label key={address.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-surface-200 p-3"><input type="radio" name="deliveryAddress" checked={selectedAddressId === address.id} onChange={() => setSelectedAddressId(address.id)} /><span className="text-sm"><strong>{address.recipientName}{address.isDefault ? " · Principal" : ""}</strong><br />{address.address}<br />{address.neighborhood}, {address.city}<br /><span className="text-xs text-surface-500">{address.recipientPhone}{address.reference ? ` · ${address.reference}` : ""}</span></span></label>)}
          {!addresses.length && <p className="text-sm text-surface-500">Aún no tienes direcciones guardadas.</p>}
          <details className="rounded-xl bg-surface-50 p-3"><summary className="cursor-pointer text-sm font-medium">Agregar dirección</summary><form onSubmit={createAddress} className="mt-3 space-y-2">
            {([ ["recipientName", "Nombre de quien recibe"], ["recipientPhone", "Teléfono"], ["city", "Ciudad"], ["neighborhood", "Barrio"], ["address", "Dirección"], ["reference", "Referencia (opcional)"] ] as const).map(([key, label]) => <input key={key} required={key !== "reference"} maxLength={key === "address" || key === "reference" ? 500 : 150} value={addressForm[key] || ""} onChange={event => setAddressForm(current => ({ ...current, [key]: event.target.value }))} placeholder={label} className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm" />)}
            <Button type="submit" fullWidth disabled={creatingAddress}>{creatingAddress ? "Guardando…" : "Guardar dirección"}</Button>
          </form></details>
          <Button variant="primary" fullWidth disabled={!selectedAddressId} onClick={() => setShowAddressSheet(false)}>Usar esta dirección</Button>
        </div>
      </BottomSheet>
    </div>
  );
};

export default Cart;
