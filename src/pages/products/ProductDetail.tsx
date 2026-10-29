import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { getDemoProduct } from "../../data/demo/catalog";
import { isDemoMode, isDemoProductId } from "../../data/demo/demoMode";
import { ProductDetailSkeleton } from "../../components/common/LoadingPatterns";
import { AsyncImage } from "../../components/common/AsyncImage";
import { FavoriteButton } from "../../components/common/FavoriteButton";

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
  const requestSequence = useRef(0);
  const isDemoProduct = isDemoMode && isDemoProductId(id);

  const loadProduct = useCallback(async () => {
    const requestId = ++requestSequence.current;
    setIsLoading(true); setError(null);
    try {
      if (isDemoProductId(id)) {
        if (!isDemoMode) { setProduct(null); setError("Este producto solo existe en la vista de demostración."); return; }
        const demoProduct = getDemoProduct(id);
        if (!demoProduct) { setProduct(null); setError("El producto demo no existe."); return; }
        if (requestId === requestSequence.current) {
          setProduct(demoProduct);
          setSelectedVariantId(demoProduct.variants?.[0]?.id);
        }
        return;
      }
      const loaded = await marketplaceApi.product(id);
      if (requestId === requestSequence.current) { setProduct(loaded); setSelectedVariantId(loaded.variants?.[0]?.id); }
    }
    catch (requestError) { if (requestId === requestSequence.current) setError(userMessageFor(requestError)); }
    finally { if (requestId === requestSequence.current) setIsLoading(false); }
  }, [id]);
  useEffect(() => { void loadProduct(); return () => { requestSequence.current += 1; }; }, [loadProduct]);

  const selectedVariant = useMemo(() => product?.variants?.find(variant => variant.id === selectedVariantId), [product, selectedVariantId]);
  const unitPrice = selectedVariant ? Number(selectedVariant.price) : product?.price ?? 0;
  const stock = selectedVariant ? (selectedVariant.inventory_tracking_enabled ? selectedVariant.stock_quantity : null) : product?.stock ?? null;
  const addToCart = async () => {
    if (!product || isDemoProduct) return;
    if (!isAuthenticated) { navigate("/login"); return; }
    setNotice("");
    try { await addItem(product, quantity, undefined, undefined, selectedVariantId); navigate("/cart"); }
    catch (requestError) { setNotice(userMessageFor(requestError)); }
  };

  if (isLoading) return <ProductDetailSkeleton />;
  if (error || !product) return <div className="page-container flex min-h-80 flex-col items-center justify-center gap-3 text-center"><p role="alert" className="text-surface-700">{error || "Producto no encontrado."}</p><Button onClick={() => void loadProduct()}>Intentar de nuevo</Button></div>;
  const unavailable = stock !== null && stock < 1;

  return <div className={`page-container page-section pb-36 lg:pb-10${isDemoProduct ? " demo-product-detail" : ""}`}>
    <div className="mb-4"><Link to="/" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-surface-600 hover:bg-white hover:text-surface-900"><Icon name="ArrowLeft" size={18} />Volver al catálogo</Link></div>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-10 xl:gap-14">
      <div className="demo-product-gallery relative min-w-0 overflow-hidden rounded-2xl bg-surface-100 sm:rounded-3xl">
        <div className="flex aspect-square max-h-[680px] snap-x snap-mandatory overflow-x-auto">
          {product.images.length && product.images.some(image => image && !image.endsWith("/icons/icon-512.svg")) ? product.images.filter(image => image && !image.endsWith("/icons/icon-512.svg")).map((image, index) => <AsyncImage key={`${image}-${index}`} src={image} {...(!isDemoProduct ? { fallbackSrc: "" } : {})} alt={`${product.name}${product.images.length > 1 ? `, imagen ${index + 1}` : ""}`} className="h-full w-full flex-none snap-center" imageClassName="object-cover" />) : <div role="img" aria-label="Fotografía del producto no disponible" className="flex h-full w-full flex-col items-center justify-center gap-3 text-surface-400"><Icon name="ImageOff" size={32} /><span className="text-sm">Fotografía no disponible</span></div>}
        </div>
        <FavoriteButton productId={product.id} productName={product.name} disabled={isDemoProduct} className="icon-control absolute right-3 top-3 z-10 bg-white/95 text-surface-700" />
      </div>

      <section className="demo-product-info min-w-0 lg:sticky lg:top-28 lg:self-start">
        {product.store.name !== "Tienda local" && <div className="mb-3">
          {product.store.slug ? <Link to={`/store/${encodeURIComponent(product.store.slug)}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg pr-2 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
            {product.store.logo && <AsyncImage src={product.store.logo} alt="" className="h-8 w-8 shrink-0 rounded-full border border-surface-200" fallbackSrc="/images/demo/category-market.svg" imageClassName="object-cover" />}
            <span className="text-sm font-medium text-surface-700">{product.store.name}</span><Icon name="ChevronRight" size={15} className="text-surface-400" />
          </Link> : <span className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-surface-700">{product.store.logo && <AsyncImage src={product.store.logo} alt="" className="h-8 w-8 shrink-0 rounded-full border border-surface-200" fallbackSrc="/images/demo/category-market.svg" imageClassName="object-cover" />}{product.store.name}</span>}
        </div>}
        <h1 className="text-2xl font-semibold leading-tight tracking-tight text-surface-900 sm:text-3xl lg:text-4xl">{product.name}</h1>
        {product.rating > 0 && <div className="mt-3 flex items-center gap-1.5 text-sm text-surface-700"><Icon name="Star" size={16} className="text-primary-700" /><span className="font-semibold">{product.rating}</span>{product.reviewCount > 0 && <span className="text-surface-500">({product.reviewCount} opiniones{isDemoProduct ? " demo" : ""})</span>}</div>}
        <div className="mt-4 flex flex-wrap items-baseline gap-2"><span className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">${unitPrice.toLocaleString("es-CO")}</span>{product.originalPrice !== undefined && product.originalPrice > unitPrice && <span className="text-sm text-surface-500 line-through">${product.originalPrice.toLocaleString("es-CO")}</span>}<span className="text-xs text-surface-500">{product.currency}</span>{isDemoProduct && <span className="basis-full text-xs font-medium text-surface-500">Precio y descuento ilustrativos · Catálogo demo</span>}</div>
        {product.description && <p className="mt-4 whitespace-pre-line text-sm leading-6 text-surface-600">{product.description}</p>}

        {product.variants && product.variants.length > 0 && <fieldset className="mt-6"><legend className="mb-3 text-sm font-semibold text-surface-900">Selecciona una variante</legend><div className="flex flex-wrap gap-2">{product.variants.map(variant => <button key={variant.id} type="button" aria-pressed={selectedVariantId === variant.id} onClick={() => { setSelectedVariantId(variant.id); setQuantity(1); }} className={`min-h-11 rounded-xl border px-3 text-left text-xs font-medium transition-colors ${selectedVariantId === variant.id ? "border-primary-800 bg-primary-50 text-primary-900" : "border-surface-300 bg-white text-surface-700 hover:border-surface-500"}`}>{variant.values.map(value => `${value.option_name}: ${value.value}`).join(" · ") || variant.sku}{variant.inventory_tracking_enabled ? ` · ${variant.stock_quantity} disp.` : ""}</button>)}</div></fieldset>}

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2"><div><span className="mb-2 block text-sm font-semibold text-surface-900">Cantidad</span><QuantitySelector quantity={quantity} {...(stock !== null ? { max: Math.max(1, stock) } : {})} onChange={setQuantity} /></div><span className="pt-6 text-xs text-surface-600">{isDemoProduct ? "Disponibilidad ilustrativa · no conectada a inventario" : stock !== null ? `${stock} disponibles` : "Disponibilidad sujeta a confirmación en checkout"}</span></div>
        {isDemoProduct ? <p className="mt-4 rounded-xl border border-surface-200 bg-surface-100 p-3 text-sm leading-5 text-surface-700">Producto ficticio de demostración. Añadir al carrito, comprar y pagar están desactivados para proteger las operaciones reales.</p> : !isAuthenticated && <p className="mt-4 rounded-xl bg-surface-100 p-3 text-sm text-surface-700">Inicia sesión para agregar productos al carrito.</p>}
        {notice && <p role="alert" className="mt-4 rounded-xl border border-primary-200 bg-primary-50 p-3 text-sm text-primary-900">{notice}</p>}

        <div className="demo-purchase-bar fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-20 flex gap-2 border-t border-surface-200 bg-white/95 p-3 backdrop-blur sm:gap-3 sm:px-6 lg:static lg:mt-7 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <Button variant="outline" size="lg" fullWidth leftIcon="ShoppingCart" className={isDemoProduct ? "demo-purchase-action" : ""} disabled={isDemoProduct || isMutating || unavailable} onClick={() => void addToCart()}>{isDemoProduct ? "Compra desactivada" : isMutating ? "Actualizando…" : unavailable ? "Agotado" : "Añadir al carrito"}</Button>
          <Button variant="primary" size="lg" fullWidth className={isDemoProduct ? "demo-purchase-action" : ""} disabled={isDemoProduct || isMutating || unavailable} onClick={() => setShowCheckoutSheet(true)}>{isDemoProduct ? "No disponible" : "Comprar"}</Button>
        </div>
      </section>
    </div>
    <BottomSheet isOpen={showCheckoutSheet} onClose={() => setShowCheckoutSheet(false)} height="h-auto"><div className="space-y-4"><h3 className="text-center text-lg font-bold text-surface-900">Confirmar compra</h3><div className="flex items-center gap-3 rounded-xl bg-surface-50 p-3"><AsyncImage src={product.images[0]} alt={product.name} className="h-16 w-16 shrink-0 rounded-lg" /><div className="min-w-0"><p className="font-medium text-surface-900">{product.name}</p><p className="mt-1 text-sm text-surface-600">Cantidad: {quantity} · ${unitPrice.toLocaleString("es-CO")} c/u</p></div></div><p className="text-center text-xs leading-5 text-surface-600">El total definitivo y la disponibilidad serán confirmados por el servidor en el checkout.</p><Button variant="primary" fullWidth size="lg" leftIcon="ShoppingCart" disabled={isMutating || unavailable} onClick={() => void addToCart()}>{isMutating ? "Actualizando…" : "Agregar y continuar al carrito"}</Button></div></BottomSheet>
  </div>;
};

export default ProductDetail;
