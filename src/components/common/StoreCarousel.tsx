import { FC } from "react";
import { Link } from "react-router-dom";
import type { StoreInfo } from "../../data/types";

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
    <div className="mb-5">
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-surface-900">{title}</h2>
          {showAll && (
            <Link to="/categories" className="text-xs font-medium text-primary-600">
              Ver todas
            </Link>
          )}
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {stores.map((store) => (
          <Link
            key={store.id}
            to={`/store/${store.id}`}
            className="flex min-w-[90px] flex-col items-center text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-surface-200">
              <img
                src={store.logo}
                alt={store.name}
                className="h-10 w-10 rounded object-contain"
                loading="lazy"
              />
            </div>
            <span className="mt-1 block text-[10px] font-medium text-surface-700 line-clamp-1">
              {store.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
