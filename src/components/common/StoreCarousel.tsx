import { FC } from "react";
import { Link } from "react-router-dom";
import type { StoreInfo } from "../../data/types";
import { AsyncImage } from "./AsyncImage";

interface StoreCarouselProps {
  stores: StoreInfo[];
  title?: string;
  showAll?: boolean;
}

export const StoreCarousel: FC<StoreCarouselProps> = ({
  stores,
  title,
  showAll = true,
}) => {
  return (
    <section className="mb-6">
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-heading">{title}</h2>
          {showAll && (
            <Link to="/categories" className="rounded-lg px-2 py-2 text-sm font-semibold text-primary-800 hover:bg-primary-50">
              Ver todas
            </Link>
          )}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-2 sm:gap-5 lg:grid lg:grid-cols-4 lg:overflow-visible xl:grid-cols-5 2xl:grid-cols-6">
        {stores.map((store) => (
          <Link
            key={store.id}
            to={`/store/${encodeURIComponent(store.slug)}`}
            className="flex min-w-[92px] flex-col items-center rounded-xl p-2 text-center transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 lg:min-w-0"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-surface-200 bg-white">
              <AsyncImage src={store.logo} alt={store.name} className="h-10 w-10 rounded" imageClassName="object-contain" fallbackSrc="/images/demo/category-market.svg" />
            </div>
            <span className="mt-2 block max-w-full text-xs font-medium text-surface-800 line-clamp-2">
              {store.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
