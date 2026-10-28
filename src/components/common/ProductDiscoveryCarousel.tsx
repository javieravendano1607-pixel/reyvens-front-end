import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { A11y, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import type { CategoryItem, Product } from "../../data/types";
import { Icon } from "../ui/Icon";
import { AsyncImage } from "./AsyncImage";
import { Skeleton } from "../ui/Skeleton";
import "swiper/css";
import "swiper/css/pagination";

interface ProductDiscoveryCarouselProps {
  products: Product[];
  categories: CategoryItem[];
  images: Record<string, string>;
  imagesLoading: boolean;
  recentSearchMatch: boolean;
  hasRecentSearches: boolean;
}

export const ProductDiscoveryCarousel: FC<ProductDiscoveryCarouselProps> = ({ products, categories, images, imagesLoading, recentSearchMatch, hasRecentSearches }) => {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  if (!products.length) return null;

  return <section className="mb-8 sm:mb-10" aria-label="Descubrimiento de productos">
    <div className="relative overflow-hidden rounded-[1.5rem] bg-[#171717] text-white sm:rounded-[2rem]">
      <Swiper
        modules={[Pagination, A11y, Keyboard]}
        onSwiper={setSwiper}
        slidesPerView={1}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        loop={products.length > 1}
        className="banner-carousel product-discovery-carousel"
        aria-label="Productos publicados en REYVENS"
        a11y={{ prevSlideMessage: "Producto anterior", nextSlideMessage: "Siguiente producto" }}
      >
        {products.map((product, index) => {
          const category = categories.find(item => item.id === product.categoryId);
          const image = images[product.id];
          const productUrl = `/product/${encodeURIComponent(product.slug || product.id)}`;
          return <SwiperSlide key={product.id}>
            <article className="grid min-h-[25rem] grid-cols-1 md:min-h-[24rem] md:grid-cols-[1fr_1fr]">
              <div className="relative z-10 flex flex-col items-start justify-center px-6 pb-8 pt-8 sm:px-10 lg:px-14">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.2em] text-white/60">{recentSearchMatch ? "A partir de tus búsquedas" : hasRecentSearches ? "Sin coincidencias recientes · otras opciones" : "Descubre el catálogo"}</p>
                {category && <span className="mb-3 inline-flex rounded-full border border-white/15 px-3 py-1 text-xs text-white/75">{category.name}</span>}
                <h2 className="max-w-xl text-3xl font-semibold leading-[1.04] tracking-[-.045em] sm:text-4xl lg:text-[3.25rem]">{product.name}</h2>
                {product.description && <p className="mt-4 line-clamp-3 max-w-lg text-sm leading-6 text-white/70 sm:text-base">{product.description}</p>}
                <p className="mt-5 text-xl font-semibold tracking-tight">${product.price.toLocaleString("es-CO")} <span className="text-xs font-medium text-white/55">COP</span></p>
                <Link to={productUrl} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-700 px-5 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  Ver producto <Icon name="ArrowRight" size={16} />
                </Link>
                <span className="absolute bottom-5 left-6 font-mono text-[10px] tracking-[.15em] text-white/35 sm:left-10 lg:left-14">{String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span>
              </div>
              <div className="relative min-h-48 overflow-hidden bg-white/[.04] md:min-h-0">
                {image ? <AsyncImage src={image} alt={product.name} fallbackSrc="" className="absolute inset-0 h-full w-full" imageClassName="object-contain p-5 sm:p-8" loading={index === 0 ? "eager" : "lazy"} /> : imagesLoading ? <Skeleton className="absolute inset-8 rounded-3xl bg-white/5" /> : <NeutralProductImage />}
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.08),transparent_65%)]" aria-hidden="true" />
              </div>
            </article>
          </SwiperSlide>;
        })}
      </Swiper>
      {products.length > 1 && <div className="absolute bottom-4 right-4 z-20 flex gap-2 sm:bottom-6 sm:right-6">
        <button type="button" onClick={() => swiper?.slidePrev()} aria-label="Producto anterior" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Icon name="ChevronLeft" size={19} /></button>
        <button type="button" onClick={() => swiper?.slideNext()} aria-label="Siguiente producto" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Icon name="ChevronRight" size={19} /></button>
      </div>}
    </div>
  </section>;
};

const NeutralProductImage: FC = () => <div role="img" className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/45" aria-label="Fotografía del producto no disponible">
  <Icon name="ImageOff" size={32} />
  <span className="text-xs font-medium">Fotografía no disponible</span>
</div>;
