import { FC } from "react";
import { Link } from "react-router-dom";
import type { CategoryItem, QuickAccessItem } from "../../data/types";
import { Icon } from "../ui/Icon";

interface CategoryGridProps {
  categories: CategoryItem[];
}

export const CategoryGrid: FC<CategoryGridProps> = ({ categories }) => {
  return (
    <div className="mb-5 grid grid-cols-4 gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          to={`/categories?categoryId=${encodeURIComponent(cat.id)}`}
          className="flex flex-col items-center"
        >
          <div className="h-16 w-16 overflow-hidden rounded-2xl">
            <img
              src={cat.image}
              alt={cat.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <span className="mt-1 text-[10px] font-medium text-surface-700">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

interface QuickAccessGridProps {
  items: QuickAccessItem[];
}

export const QuickAccessGrid: FC<QuickAccessGridProps> = ({ items }) => {
  return (
    <div className="mb-5 grid grid-cols-3 gap-2">
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.link}
          className={`flex flex-col items-center gap-1.5 rounded-xl p-4 shadow-sm ${item.color} transition-transform duration-200 hover:scale-105`}
        >
          <div className="text-2xl">
            <Icon name={item.icon} size={24} />
          </div>
          <span className="text-center text-xs font-medium">
            {item.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

