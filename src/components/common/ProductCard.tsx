import { FC } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import type { Product } from "../../data/types";
import { getDemoProduct } from "../../data/demo/catalog";
import { isDemoMode, isDemoProductId } from "../../data/demo/demoMode";
import { AsyncImage } from "./AsyncImage";

interface ProductCardProps { product: Product; }

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const image = product.images[0];
  const demoProduct = isDemoMode && isDemoProductId(product.id) ? getDemoProduct(product.id) : undefined;
  const usesIllustration = !image || image.endsWith("/icons/icon-512.svg");
  const hasStoreName = product.store.name !== "Tienda local";
  return (
    <Link to={`/product/${product.slug || product.id}`} className={`product-card group flex min-w-0 flex-col overflow-hidden bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_-34px_rgba(18,18,18,.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 motion-reduce:transform-none${demoProduct ? " product-card--demo" : ""}`}>
      <div className={`product-card__visual relative aspect-[.88/1] overflow-hidden bg-surface-100${demoProduct ? ` product-card__visual--${demoProduct.categoryId.replace("demo-category-", "")}` : ""}`}>
        {usesIllustration && !demoProduct ? <span role="img" aria-label="Fotografía del producto no disponible" className="flex h-full w-full flex-col items-center justify-center gap-2 text-surface-400"><Icon name="ImageOff" size={24} /><span className="text-[10px] font-medium">Fotografía no disponible</span></span> : <AsyncImage src={image} alt={product.name} {...(!demoProduct ? { fallbackSrc: "" } : {})} className="h-full w-full" imageClassName={`transition-transform duration-500 group-hover:scale-[1.045] motion-reduce:transform-none${demoProduct ? " product-card__image--demo" : ""}`} />}
        {product.discount !== undefined && product.discount > 0 && <span className="absolute left-2 top-2 rounded-md bg-primary-700 px-2 py-1 text-[11px] font-bold text-white sm:left-3 sm:top-3">-{product.discount}%</span>}
        {demoProduct && <span className="absolute right-2 top-2 rounded-full border border-white/80 bg-white/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-surface-800 shadow-sm">Demo</span>}
      </div>
      <div className="flex flex-1 flex-col px-2 pb-3 pt-3 sm:px-3 sm:pb-4">
        {hasStoreName && <div className="mb-1.5 flex min-w-0 items-center gap-1.5">
          {product.store.logo && <AsyncImage src={product.store.logo} alt="" className="h-5 w-5 shrink-0 rounded-full" fallbackSrc="/images/demo/category-market.svg" />}
          <span className="truncate text-xs font-medium text-surface-600">{product.store.name}</span>
        </div>}
        <h3 className="min-h-10 text-sm font-medium leading-5 text-surface-900 line-clamp-2 group-hover:text-primary-800">{product.name}</h3>
        {demoProduct && <span className="mt-1 w-fit rounded-full bg-surface-100 px-2 py-0.5 text-[10px] font-semibold text-surface-600">{demoProduct.tags[0]}</span>}
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-2">
          <span className="text-base font-semibold tracking-tight text-surface-900 sm:text-lg">${product.price.toLocaleString("es-CO")}</span>
          {product.originalPrice !== undefined && product.originalPrice > product.price && <span className="text-xs text-surface-500 line-through">${product.originalPrice.toLocaleString("es-CO")}</span>}
        </div>
        <div className="mt-2 flex min-h-5 items-center justify-between gap-2">
          {product.rating > 0 && <span className="inline-flex items-center gap-1 text-xs text-surface-700"><Icon name="Star" size={14} className="text-primary-700" /><span>{product.rating}</span>{product.reviewCount > 0 && <span className="text-surface-500">({product.reviewCount})</span>}{demoProduct && <span className="text-surface-500">demo</span>}</span>}
          {product.pointsReward > 0 && <span className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-2 py-1 text-[10px] font-semibold text-surface-700"><Icon name="Award" size={12} />+{product.pointsReward} pts</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
