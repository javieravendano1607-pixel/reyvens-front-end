import { FC, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CategoryGrid } from "../../components/common/CategoryGrid";
import { ProductGrid } from "../../components/common/ProductGrid";
import { Icon } from "../../components/ui/Icon";
import { Modal } from "../../components/ui/Modal";
import { useCatalogCategories, useCatalogProducts } from "../../hooks/useCatalog";
import { BannerCarousel } from "../../components/common/BannerCarousel";
import { banners } from "../../data";
import { isDemoMode } from "../../data/demo/demoMode";
import { getDemoProduct } from "../../data/demo/catalog";
import type { Product } from "../../data/types";
import { CategoryGridSkeleton, ProductGridSkeleton } from "../../components/common/LoadingPatterns";
import { AsyncImage } from "../../components/common/AsyncImage";
import { ProductDiscoveryCarousel } from "../../components/common/ProductDiscoveryCarousel";
import { marketplaceApi } from "../../services/marketplace";
import { useRecentSearches } from "../../hooks/useRecentSearches";

const demoBanners = banners.map((banner, index) => ({
  ...banner,
  title: index === 0 ? "Encuentra lo que te mueve." : "Descubrir cambia el día.",
  subtitle: index === 0 ? "Tecnología, estilo y hallazgos locales. Todo, en un solo lugar." : "Ve más allá de lo de siempre con esta colección visual de demostración.",
  cta: "Explorar demo",
  image: index === 0 ? "/images/demo/catalog/phone.svg" : "/images/demo/catalog/sneaker.svg",
}));

export const Home: FC = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { products, isLoading, error, refresh } = useCatalogProducts();
  const { categories, isLoading: categoriesLoading, error: categoriesError, refresh: refreshCategories } = useCatalogCategories();
  const { recentSearches } = useRecentSearches();
  const discoverySelection = useMemo(() => selectDiscoveryProducts(products, categories, recentSearches), [products, categories, recentSearches]);
  const [discoveryImages, setDiscoveryImages] = useState<Record<string, string>>({});
  const [discoveryImagesLoading, setDiscoveryImagesLoading] = useState(false);
  const homeBanners = isDemoMode ? demoBanners : banners;
  useEffect(() => {
    if (!isDemoMode) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-demo-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      sections.forEach(section => section.dataset.demoVisible = "true");
      return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.demoVisible = "true";
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08, rootMargin: "0px 0px -48px 0px" });
    sections.forEach(section => { section.dataset.demoRevealReady = "true"; observer.observe(section); });
    return () => observer.disconnect();
  }, [isDemoMode, products.length, categories.length, isLoading]);
  useEffect(() => {
    if (isDemoMode || discoverySelection.products.length === 0) {
      setDiscoveryImages({});
      setDiscoveryImagesLoading(false);
      return;
    }

    const controller = new AbortController();
    setDiscoveryImages({});
    setDiscoveryImagesLoading(true);
    void Promise.all(discoverySelection.products.map(async product => {
      try {
        const detail = await marketplaceApi.product(product.slug || product.id, controller.signal);
        const image = detail.images.find(url => url && !url.endsWith("/icons/icon-512.svg"));
        return image ? [product.id, image] as const : null;
      } catch {
        return null;
      }
    })).then(results => {
      if (controller.signal.aborted) return;
      setDiscoveryImages(Object.fromEntries(results.filter((entry): entry is readonly [string, string] => entry !== null)));
      setDiscoveryImagesLoading(false);
    });
    return () => controller.abort();
  }, [discoverySelection.products]);
  if (isDemoMode) {
    const featured = products.filter(product => demoTag(product, "Destacado"));
    const newArrivals = products.filter(product => demoNew(product) && !featured.includes(product));
    const otherProducts = products.filter(product => !featured.includes(product) && !newArrivals.includes(product));
    const phone = getDemoProduct("demo-product-phone");
    const sneaker = getDemoProduct("demo-product-sneaker");
    return <div className="demo-home pb-10">
      <div className="page-container demo-home__intro"><span className="demo-live-mark"><i /> Una tienda para descubrir · Escenario visual</span><button type="button" onClick={() => setShowLocationModal(true)} className="demo-location-link" aria-label="Información de ubicación"><Icon name="MapPin" size={15} /> Sincelejo <span>·</span> Ubicación de muestra</button></div>
      <section className="page-container demo-home__hero-wrap"><div data-demo-reveal><BannerCarousel banners={homeBanners} /></div></section>

      <section className="page-container demo-home__categories" data-demo-reveal>
        <div className="demo-section-head"><div><p className="demo-eyebrow">Mira alrededor</p><h2>Un mundo de posibilidades.</h2></div><Link to="/categories" className="demo-text-link">Ver todas las categorías <Icon name="ArrowRight" size={16} /></Link></div>
        {categoriesLoading ? <CategoryGridSkeleton count={5} /> : categoriesError ? <DemoError message={categoriesError} retry={() => void refreshCategories()} /> : <CategoryGrid categories={categories} />}
      </section>

      {isLoading ? <div className="page-container"><ProductGridSkeleton count={6} label="Cargando catálogo de demostración" /></div> : error ? <div className="page-container"><DemoError message={error} retry={() => void refresh()} /></div> : <>
        <DemoProductSection eyebrow="Selección REYVENS" title="Piezas para descubrir" description="Una selección ficticia para explorar el lenguaje visual del marketplace." products={featured.slice(0, 6)} />

        {phone && <section className="page-container demo-feature-wrap" data-demo-reveal><article className="demo-feature demo-feature--dark"><div className="demo-feature__copy"><p className="demo-eyebrow demo-eyebrow--light">TECNOLOGÍA · COLECCIÓN DEMO</p><h2>Todo lo que imaginas.<br /><span>Más cerca.</span></h2><p>Una mirada a cómo podría sentirse descubrir tecnología en REYVENS.</p><Link to={`/product/${phone.slug}`} className="demo-feature__link">Conocer la pieza <Icon name="ArrowRight" size={16} /></Link></div><div className="demo-feature__image demo-feature__image--phone"><AsyncImage src={phone.images[0]} alt="Ilustración demo del teléfono Nova" className="h-full w-full" imageClassName="object-contain" /><span className="demo-art-note">PRODUCTO ILUSTRATIVO</span></div><span className="demo-feature__index">01 / TECNOLOGÍA</span></article></section>}

        <DemoProductSection eyebrow="Lo nuevo en el escenario" title="Novedades que inspiran" description="Piezas ficticias incorporadas a esta experiencia de demostración." products={newArrivals.slice(0, 4)} />

        {sneaker && <section className="page-container demo-feature-wrap" data-demo-reveal><article className="demo-feature demo-feature--light"><div className="demo-feature__image demo-feature__image--shoe"><AsyncImage src={sneaker.images[0]} alt="Ilustración demo de los tenis urbanos Brisa" className="h-full w-full" imageClassName="object-contain" /><span className="demo-art-note">CATÁLOGO DE DEMOSTRACIÓN</span></div><div className="demo-feature__copy"><p className="demo-eyebrow">ESTILO · DISEÑO LOCAL</p><h2>El ritmo de todos los días.</h2><p>Una selección de calzado ficticia, presentada para imaginar la experiencia de compra.</p><Link to={`/product/${sneaker.slug}`} className="demo-feature__link">Explorar calzado <Icon name="ArrowRight" size={16} /></Link></div><span className="demo-feature__index">02 / ESTILO</span></article></section>}

        <DemoProductSection eyebrow="El mercado en movimiento" title="Más para explorar" description="Tecnología, estilo, hogar y cuidado personal en un solo recorrido." products={otherProducts} />
        <section className="page-container demo-store-note" data-demo-reveal><div className="demo-store-note__inner"><div><p className="demo-eyebrow demo-eyebrow--light">COMERCIOS · ESCENARIO DEMO</p><h2>Un lugar para descubrir marcas locales.</h2><p>Explora escaparates ficticios y conoce cómo podrían convivir dentro del marketplace.</p></div><Link to="/categories" className="demo-feature__link">Explorar el mercado <Icon name="ArrowRight" size={16} /></Link><span className="demo-store-note__mark">R<span>.</span></span></div></section>
        <div className="page-container demo-catalog-end"><Link to="/categories" className="demo-end-link">Ver las cinco categorías <Icon name="ArrowRight" size={16} /></Link></div>
      </>}
      <Modal isOpen={showLocationModal} onClose={() => setShowLocationModal(false)} title="Ubicación" size="sm"><p className="text-sm leading-6 text-surface-600">La selección de ciudad todavía no está conectada. Esta vista demo no consulta ubicación ni crea pedidos.</p></Modal>
    </div>;
  }
  const remainingProducts = products.filter(product => !discoverySelection.products.some(selected => selected.id === product.id));
  return (
    <div className="page-container pb-8">
      <section className="page-section pb-5 sm:pb-7">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-surface-200 pb-5 sm:mb-8 sm:flex-row sm:items-end">
          <div><p className="mb-2 text-[11px] font-semibold uppercase tracking-[.18em] text-primary-800">REYVENS · Mercado local</p><h1 className="max-w-2xl text-3xl font-semibold leading-[1.04] tracking-[-.045em] text-surface-900 sm:text-4xl lg:text-5xl">Descubre lo que ya está publicado.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-surface-600">Explora productos y categorías disponibles en el catálogo.</p></div>
          <div className="flex shrink-0 gap-2"><Link to="/search" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-surface-300 bg-white px-4 text-sm font-medium text-surface-800 transition-colors hover:border-primary-700 hover:text-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"><Icon name="Search" size={17} />Buscar</Link><button type="button" onClick={() => setShowLocationModal(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-surface-300 bg-white px-3 text-sm font-medium text-surface-800 transition-colors hover:border-primary-700 hover:text-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700" aria-label="Información de ubicación"><Icon name="MapPin" size={17} /><span className="hidden min-[380px]:inline">Ubicación</span></button></div>
        </div>
        {error && products.length === 0 ? <div className="surface-card mb-6 px-5 py-8 text-center"><p role="alert" className="text-sm text-surface-700">{error}</p><button type="button" onClick={() => void refresh()} className="mt-3 min-h-10 rounded-lg px-3 text-sm font-semibold text-primary-800 hover:bg-primary-50">Reintentar carga de productos</button></div> : discoverySelection.products.length > 0 ? <ProductDiscoveryCarousel products={discoverySelection.products} categories={categories} images={discoveryImages} imagesLoading={discoveryImagesLoading} recentSearchMatch={discoverySelection.matchedRecentSearch} hasRecentSearches={recentSearches.length > 0} /> : null}
        {error && products.length > 0 && <p role="status" className="mb-5 rounded-lg bg-surface-100 px-3 py-2 text-xs text-surface-600">No se pudo actualizar el catálogo. Se conservan los productos cargados anteriormente.</p>}
        <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
          <div><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-800">Explora el mercado</p><h2 className="section-heading">Categorías disponibles</h2></div>
          {categories.length > 0 && <Link to="/categories" className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-surface-700 transition-colors hover:bg-white hover:text-primary-800">Ver todas <Icon name="ArrowRight" size={15} /></Link>}
        </div>
        {categoriesLoading && categories.length === 0 ? <CategoryGridSkeleton count={5} /> : categoriesError && categories.length === 0 ? <div className="rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-700"><span role="alert">{categoriesError}</span><button type="button" onClick={() => void refreshCategories()} className="ml-3 font-semibold text-primary-800 underline underline-offset-2">Reintentar</button></div> : categories.length > 0 ? <div className="home-reveal home-reveal--third"><CategoryGrid categories={categories.slice(0, 6)} /></div> : null}
      </section>

      <section className="home-reveal home-reveal--second border-t border-surface-200 py-6 sm:py-8 lg:py-10">
        <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
          <div><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-800">El catálogo</p><h2 className="section-heading text-xl sm:text-2xl">Más productos publicados</h2><p className="mt-1 text-sm text-surface-600">Productos disponibles en REYVENS.</p></div>
          <Link to="/categories" className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-primary-800 transition-colors hover:bg-primary-50">Ver catálogo <Icon name="ArrowRight" size={16} /></Link>
        </div>
        {isLoading && products.length === 0 ? <ProductGridSkeleton count={8} label="Cargando catálogo" /> : error && products.length === 0 ? null : remainingProducts.length ? <ProductGrid products={remainingProducts.slice(0, 20)} /> : products.length === 0 && !error && !isLoading ? <div className="rounded-2xl border border-dashed border-surface-300 bg-white px-5 py-10 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 text-surface-600"><Icon name="ShoppingBag" size={23} /></span><h3 className="mt-4 font-semibold text-surface-900">Aún no hay productos publicados</h3><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-surface-600">{recentSearches.length ? "No hay coincidencias con tus búsquedas recientes y todavía no hay productos publicados." : "Cuando haya productos activos en tiendas y categorías disponibles, aparecerán aquí."}</p>{categories.length > 0 && <Link to="/categories" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary-800 transition-colors hover:bg-primary-50">Explorar categorías <Icon name="ArrowRight" size={15} /></Link>}</div> : products.length === 0 ? <div className="surface-card px-5 py-8 text-center"><p role="alert" className="text-sm text-surface-700">{error}</p><button type="button" onClick={() => void refresh()} className="mt-3 min-h-10 rounded-lg px-3 text-sm font-semibold text-primary-800 hover:bg-primary-50">Intentar de nuevo</button></div> : null}
      </section>
      <Modal isOpen={showLocationModal} onClose={() => setShowLocationModal(false)} title="Ubicación" size="sm">
        <p className="text-sm leading-6 text-surface-600">La selección de ciudad todavía no está conectada. La dirección guardada se solicita al realizar el checkout.</p>
      </Modal>
    </div>
  );
};

const demoTag = (product: Product, tag: string): boolean =>
  isDemoMode && "tags" in product && Array.isArray(product.tags) && product.tags.includes(tag);

const demoNew = (product: Product): boolean =>
  isDemoMode && Boolean(getDemoProduct(product.id)?.isNew);

function selectDiscoveryProducts(products: Product[], categories: { id: string; name: string }[], recentSearches: string[]) {
  const categoryNames = new Map(categories.map(category => [category.id, category.name]));
  const searchableText = (product: Product) => [
    product.name,
    product.description,
    product.categoryId ? categoryNames.get(product.categoryId) : "",
    product.store.name !== "Tienda local" ? product.store.name : "",
  ].filter(Boolean).join(" ").toLocaleLowerCase("es-CO");

  const recentMatches = recentSearches.flatMap(search => {
    const normalized = search.toLocaleLowerCase("es-CO");
    return products.filter(product => searchableText(product).includes(normalized));
  }).filter((product, index, matches) => matches.findIndex(item => item.id === product.id) === index);
  if (recentMatches.length) return { products: recentMatches.slice(0, 3), matchedRecentSearch: true };

  const diverse: Product[] = [];
  const seenCategories = new Set<string>();
  products.forEach(product => {
    if (diverse.length >= 3 || !product.categoryId || seenCategories.has(product.categoryId)) return;
    diverse.push(product);
    seenCategories.add(product.categoryId);
  });
  products.forEach(product => {
    if (diverse.length < 3 && !diverse.some(item => item.id === product.id)) diverse.push(product);
  });
  return { products: diverse, matchedRecentSearch: false };
}

const DemoError: FC<{ message: string; retry: () => void }> = ({ message, retry }) => <div className="surface-card px-5 py-10 text-center"><p role="alert" className="text-sm text-surface-700">{message}</p><button type="button" onClick={retry} className="mt-3 min-h-10 rounded-lg px-3 text-sm font-semibold text-primary-800 hover:bg-primary-50">Intentar de nuevo</button></div>;

const DemoProductSection: FC<{ eyebrow: string; title: string; description: string; products: Product[] }> = ({ eyebrow, title, description, products }) => {
  if (!products.length) return null;
  return <section className="page-container demo-product-section" data-demo-reveal>
    <div className="demo-section-head demo-section-head--products"><div><p className="demo-eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p></div><Link to="/categories" className="demo-text-link">Explorar <Icon name="ArrowRight" size={16} /></Link></div>
    <ProductGrid products={products} />
  </section>;
};

export default Home;
