import { FC } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import type { StoreInfo } from "../../data/types";

interface StoreBadgeProps {
  store: StoreInfo;
  showRating?: boolean;
  showDelivery?: boolean;
}

export const StoreBadge: FC<StoreBadgeProps> = ({ store, showRating = true, showDelivery = true }) => {
  return (
    <Link to={`/store/${store.id}`} className="flex items-center gap-2 rounded-xl bg-white p-2.5 shadow-sm transition-all duration-200 hover:shadow-md">
      <img
        src={store.logo}
        alt={store.name}
        className="h-10 w-10 rounded object-contain"
        loading="lazy"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-surface-900">{store.name}</span>
          {store.verified && (
            <Icon name="ShieldCheck" size={12} color="#3b82f6" />
          )}
        </div>
        {showRating && store.rating && (
          <div className="flex items-center gap-0.5">
            <Icon name="Star" size={10} color="#F59E1B" />
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

