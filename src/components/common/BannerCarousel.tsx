import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import type { CarouselBanner } from "../../data/types";
import { A11y, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { isDemoMode } from "../../data/demo/demoMode";
import { AsyncImage } from "./AsyncImage";
import "swiper/css";
import "swiper/css/pagination";

interface BannerCarouselProps {
  banners: CarouselBanner[];
}

export const BannerCarousel: FC<BannerCarouselProps> = ({ banners }) => {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  return (
    <section className={`hero-carousel relative mb-5 overflow-hidden rounded-[1.35rem]${isDemoMode ? " hero-carousel--demo" : ""}`} aria-label="Presentación visual de REYVENS" aria-roledescription="carrusel">
      <Swiper
        modules={[Pagination, A11y, Keyboard]}
        onSwiper={setSwiper}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        tabIndex={0}
        aria-label="Carrusel de exploración REYVENS; usa las flechas del teclado para cambiar de presentación"
        className="banner-carousel"
        loop
        a11y={{ prevSlideMessage: "Presentación anterior", nextSlideMessage: "Siguiente presentación" }}
      >
        {banners.map((banner, index) => {
          const HeadingTag = index === 0 ? "h1" : "h2";
          return (
            <SwiperSlide key={banner.id}>
            <div className={`hero-slide grid min-h-0 grid-cols-1 overflow-hidden bg-[#171717] text-white md:min-h-[23rem] md:grid-cols-[.88fr_1.12fr]${isDemoMode ? " hero-slide--demo" : ""}`}>
              <div className={`relative z-10 flex flex-col items-start justify-center px-5 pb-8 pt-7 sm:px-8 lg:px-10 lg:py-10${isDemoMode ? " hero-slide__copy--demo" : ""}`}>
                <span className="mb-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-white/70 sm:text-[11px]"><span className="h-2 w-2 rounded-full bg-primary-600" />REYVENS <span className="text-white/35">/</span> Descubre</span>
                <HeadingTag className="max-w-xl text-[2.55rem] font-semibold leading-[.98] tracking-[-.055em] sm:text-5xl lg:text-[3.65rem]">{banner.title}</HeadingTag>
                <p className="mt-4 max-w-md text-sm leading-6 text-white/75 sm:text-base">{banner.subtitle}</p>
                <Link to={banner.link} className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-primary-700 px-5 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-600 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  {banner.cta}<Icon name="ArrowRight" size={16} />
                </Link>
                <span className="absolute bottom-5 right-5 font-mono text-[10px] tracking-[.15em] text-white/35 lg:bottom-8 lg:left-10 lg:right-auto">{String(index + 1).padStart(2, "0")} — REYVENS</span>
              </div>
              <div className={`hero-art relative min-h-44 overflow-hidden sm:min-h-60 md:min-h-0${isDemoMode ? " hero-art--demo" : ""}`}>
                <AsyncImage src={banner.image} alt="" fallbackSrc={isDemoMode ? "/images/demo/category-market.svg" : ""} className="absolute inset-0 h-full w-full" imageClassName={`object-cover${isDemoMode ? " hero-art__image--demo" : ""}`} loading="eager" />
                {isDemoMode && <span className="absolute bottom-4 left-4 rounded-full border border-black/10 bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.11em] text-surface-800 backdrop-blur-sm sm:bottom-5 sm:left-5">Arte ilustrativo · catálogo demo</span>}
              </div>
            </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {banners.length > 1 && <div className="hero-carousel__controls absolute bottom-4 right-4 z-20 flex gap-2 sm:bottom-5 sm:right-5">
        <button type="button" onClick={() => swiper?.slidePrev()} aria-label="Presentación anterior" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-surface-900/75 text-white backdrop-blur transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Icon name="ChevronLeft" size={19} /></button>
        <button type="button" onClick={() => swiper?.slideNext()} aria-label="Siguiente presentación" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-surface-900/75 text-white backdrop-blur transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Icon name="ChevronRight" size={19} /></button>
      </div>}
    </section>
  );
};
