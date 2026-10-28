import { FC } from "react";
import { Link } from "react-router-dom";
import type { CategoryItem, QuickAccessItem } from "../../data/types";
import { Icon } from "../ui/Icon";
import { getDemoCategory } from "../../data/demo/catalog";
import { isDemoMode } from "../../data/demo/demoMode";
import { AsyncImage } from "./AsyncImage";

interface CategoryGridProps {
  categories: CategoryItem[];
}

export const CategoryGrid: FC<CategoryGridProps> = ({ categories }) => {
  return (
    <div className="category-grid mb-5 grid grid-cols-2 gap-3 min-[440px]:grid-cols-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
      {categories.map((cat) => (
        <CategoryTile key={cat.id} category={cat} />
      ))}
    </div>
  );
};

const categoryArtwork = (name: string): string => {
  const normalized = name.toLocaleLowerCase("es-CO");
  if (/(tecnolog|electr|celular|comput|audio)/.test(normalized)) return "/images/demo/category-tech.svg";
  if (/(calzado|zapato|zapat|tenis)/.test(normalized)) return "/images/demo/category-footwear.svg";
  if (/(ropa|moda|vestuario|prenda)/.test(normalized)) return "/images/demo/category-apparel.svg";
  if (/(hogar|ferreter|cocina|mueble|decor)/.test(normalized)) return "/images/demo/category-home.svg";
  return "/images/demo/category-market.svg";
};

const CategoryTile: FC<{ category: CategoryItem }> = ({ category }) => {
  const demoDetails = isDemoMode ? getDemoCategory(category.id) : undefined;
  const knownPlaceholder = !category.image || category.image.endsWith("/icons/icon-512.svg");
  const illustrative = knownPlaceholder;
  return (
    <Link to={`/categories?categoryId=${encodeURIComponent(category.id)}`} className={`category-tile group block min-w-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-700${demoDetails ? " category-tile--demo" : ""}`}>
      <div className="category-tile__visual relative aspect-[1.16/1] overflow-hidden rounded-2xl bg-surface-200 sm:aspect-[1.12/1]">
        <AsyncImage src={illustrative ? categoryArtwork(category.name) : category.image} alt="" fallbackSrc={categoryArtwork(category.name)} className="h-full w-full" imageClassName="transition-transform duration-300 group-hover:scale-[1.045] motion-reduce:transform-none" />
        {illustrative && <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-[.08em] text-surface-700 backdrop-blur-sm">Ilustración</span>}
        {demoDetails && <div className="category-tile__caption"><span>{String(demoDetails.productCount).padStart(2, "0")} piezas demo</span><strong>{category.name}</strong></div>}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-primary-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>
      {!demoDetails && <span className="mt-2.5 block text-sm font-semibold leading-5 text-surface-900 transition-colors group-hover:text-primary-800 line-clamp-2">{category.name}</span>}
      {demoDetails && <span className="category-tile__description">{demoDetails.description}</span>}
    </Link>
  );
};

interface QuickAccessGridProps {
  items: QuickAccessItem[];
}

export const QuickAccessGrid: FC<QuickAccessGridProps> = ({ items }) => {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.link}
          className="flex min-h-24 flex-row items-center gap-3 rounded-2xl border border-surface-200 bg-white p-3 text-surface-800 shadow-sm transition-shadow duration-150 hover:shadow-md max-[399px]:flex-col max-[399px]:items-start max-[399px]:gap-2 sm:flex-col sm:justify-center sm:p-4"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-100 text-primary-800 sm:h-12 sm:w-12">
            <Icon name={item.icon} size={24} />
          </div>
          <span className="min-w-0 break-words text-left text-sm font-semibold sm:text-center">
            {item.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

