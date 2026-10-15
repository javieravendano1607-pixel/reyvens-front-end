import { FC } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import type { CarouselBanner } from "../../data/types";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

interface BannerCarouselProps {
  banners: CarouselBanner[];
}

export const BannerCarousel: FC<BannerCarouselProps> = ({ banners }) => {
  return (
    <div className="mb-5">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        spaceBetween={16}
        slidesPerView={1}
        pagination={{ clickable: true }}
        className="pb-6"
        loop
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className={`relative flex h-40 items-end rounded-2xl p-5 text-white shadow-lg bg-gradient-to-r ${banner.bgColor}`}
            >
              <div className="absolute inset-0 rounded-2xl">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="h-full w-full rounded-2xl object-cover opacity-25"
                  loading="lazy"
                />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold">{banner.title}</h2>
                <p className="text-sm opacity-90">{banner.subtitle}</p>
                <Link
                  to={banner.link}
                  className="mt-2 inline-flex items-center text-sm font-bold underline"
                >
                  {banner.cta}
                  <Icon name="ArrowRight" size={14} className="ml-1" color="currentColor" />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-button-prev-custom !static !absolute !-left-4 !w-8 !h-8 !rounded-full !bg-white/90"></div>
      <div className="swiper-button-next-custom !static !absolute !w-8 !h-8 !rounded-full !bg-white/90"></div>
    </div>
  );
};
