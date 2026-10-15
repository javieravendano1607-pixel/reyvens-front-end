import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { Button } from "../../components/ui/Button";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { QuantitySelector } from "../../components/common/Selectors";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { marketplaceApi } from "../../services/marketplace";
import { userMessageFor } from "../../services/api";
import type { Product } from "../../data/types";

export const ProductDetail: FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, isMutating } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>();
  const [showCheckoutSheet, setShowCheckoutSheet] = useState(false);
  const [notice, setNotice] = useState("");

  const loadProduct = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const loaded = await marketplaceApi.product(id);
      setProduct(loaded);
      setSelectedVariantId(loaded.variants?.[0]?.id);
    } catch (requestError) { setError(userMessageFor(requestError)); }
    finally { setIsLoading(false); }
  }, [id]);
  useEffect(() => { void loadProduct(); }, [loadProduct]);

  const selectedVariant = useMemo(() => product?.variants?.find(variant => variant.id === selectedVariantId), [product, selectedVariantId]);
  const unitPrice = selectedVariant ? Number(selectedVariant.price) : product?.price ?? 0;
  const stock = selectedVariant
    ? (selectedVariant.inventory_tracking_enabled ? selectedVariant.stock_quantity : null)
    : product?.stock ?? null;

  const addToCart = async () => {
    if (!product) return;
    if (!isAuthenticated) { navigate("/login"); return; }
    setNotice("");
    try {
      await addItem(product, quantity, undefined, undefined, selectedVariantId);
      navigate("/cart");
    } catch (requestError) { setNotice(userMessageFor(requestError)); }
  };

  if (isLoading) return <div role="status" className="flex min-h-80 items-center justify-center text-sm text-surface-500">Cargando producto…</div>;
  if (error || !product) return <div className="flex min-h-80 flex-col items-center justify-center gap-3 px-4 text-center"><p role="alert" className="text-surface-600">{error || "Producto no encontrado."}</p><Button onClick={() => void loadProduct()}>Intentar de nuevo</Button></div>;

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="relative">
        <div className="flex h-72 overflow-x-auto snap-x snap-mandatory">
          {product.images.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full flex-none snap-center object-cover" />)}
        </div>
        <Link to="/" className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-surface-700"><Icon name="ArrowLeft" size={18} /></Link>
        <button type="button" disabled title="Favoritos no disponible" className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-surface-400"><Icon name="Heart" size={18} /></button>
      </div>
      <div className="px-4 py-4">
        <div className="mb-2 flex items-center gap-2"><img src={product.store.logo} alt="" className="h-5 w-5 rounded" /><span className="text-xs font-medium text-surface-600">{product.store.name}</span></div>
        <h1 className="text-lg font-bold text-surface-900">{product.name}</h1>
        <div className="mt-2 flex items-baseline gap-2"><span className="text-xl font-bold text-surface-900">${unitPrice.toLocaleString("es-CO")}</span>{product.originalPrice && product.originalPrice > unitPrice && <span className="text-sm text-surface-500 line-through">${product.originalPrice.toLocaleString("es-CO")}</span>}</div>
        <p className="mt-2 text-sm text-surface-600">{product.description}</p>
        {product.variants && product.variants.length > 0 && <fieldset className="mt-4"><legend className="mb-2 text-xs font-medium text-surface-700">Selecciona una variante</legend><div className="flex flex-wrap gap-2">{product.variants.map(variant => <button key={variant.id} type="button" onClick={() => { setSelectedVariantId(variant.id); setQuantity(1); }} className={`rounded-lg border px-3 py-2 text-xs ${selectedVariantId === variant.id ? "border-primary-600 bg-primary-50 text-primary-700" : "border-surface-300 text-surface-700"}`}>{variant.values.map(value => `${value.option_name}: ${value.value}`).join(" · ") || variant.sku}{variant.inventory_tracking_enabled ? ` · ${variant.stock_quantity} disp.` : ""}</button>)}</div></fieldset>}
        <div className="mt-4"><label className="mb-1 block text-xs font-medium text-surface-700">Cantidad</label><QuantitySelector quantity={quantity} {...(stock !== null ? { max: Math.max(1, stock) } : {})} onChange={setQuantity} /><span className="ml-3 text-xs text-surface-500">{stock !== null ? `${stock} disponibles` : "Disponibilidad sujeta a confirmación en checkout"}</span></div>
        {!isAuthenticated && <p className="mt-2 text-xs text-primary-600">Inicia sesión para agregar productos al carrito.</p>}
        {notice && <p role="alert" className="mt-3 text-sm text-primary-700">{notice}</p>}
      </div>
      <div className="fixed bottom-20 left-0 right-0 flex gap-3 px-4 pb-4"><Button variant="outline" size="lg" fullWidth leftIcon="ShoppingCart" disabled={isMutating || (stock !== null && stock < 1)} onClick={() => void addToCart()}>{isMutating ? "Actualizando…" : "Añadir al carrito"}</Button><Button variant="gold" size="lg" fullWidth disabled={isMutating || (stock !== null && stock < 1)} onClick={() => setShowCheckoutSheet(true)}>Comprar</Button></div>
      <BottomSheet isOpen={showCheckoutSheet} onClose={() => setShowCheckoutSheet(false)} height="h-auto"><div className="space-y-4"><h3 className="text-center text-lg font-bold">Confirmar compra</h3><div className="flex items-center justify-center gap-3 rounded-xl bg-surface-50 p-3"><img src={product.images[0]} alt={product.name} className="h-16 w-16 rounded-lg object-cover" /><div><p className="font-medium">{product.name}</p><p className="text-sm text-surface-600">Cantidad: {quantity} · ${unitPrice.toLocaleString("es-CO")} c/u</p></div></div><p className="text-center text-xs text-surface-500">El total definitivo y la disponibilidad serán confirmados por el servidor en el checkout.</p><Button variant="primary" fullWidth size="lg" leftIcon="ShoppingCart" disabled={isMutating} onClick={() => void addToCart()}>Agregar y continuar al carrito</Button></div></BottomSheet>
    </div>
  );
};

export default ProductDetail;
