import { FC } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import type { StoreInfo } from "../../data/types";
import { AsyncImage } from "./AsyncImage";

interface StoreBadgeProps {
  store: StoreInfo;
  showRating?: boolean;
  showDelivery?: boolean;
}

export const StoreBadge: FC<StoreBadgeProps> = ({ store, showRating = true, showDelivery = true }) => {
  return (
    <Link to={`/store/${encodeURIComponent(store.slug)}`} className="flex items-center gap-2 rounded-xl bg-white p-2.5 transition-colors duration-150 hover:bg-surface-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
      <AsyncImage src={store.logo} alt={store.name} className="h-10 w-10 shrink-0 rounded" imageClassName="object-contain" fallbackSrc="/images/demo/category-market.svg" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-surface-900">{store.name}</span>
          {store.verified && (
            <Icon name="ShieldCheck" size={14} className="text-surface-700" />
          )}
        </div>
        {showRating && store.rating && (
          <div className="flex items-center gap-0.5">
            <Icon name="Star" size={12} className="text-primary-700" />
            <span className="text-[10px] text-surface-600">{store.rating}</span>
          </div>
        )}
        {showDelivery && store.deliveryTime && (
          <span className="text-[10px] text-surface-600">{store.deliveryTime}</span>
        )}
      </div>
    </Link>
  );
};

