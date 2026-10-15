import { FC } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import type { Product } from "../../data/types";

interface ProductCardProps { product: Product; }

export const ProductCard: FC<ProductCardProps> = ({ product }) => (
  <Link to={`/product/${product.slug || product.id}`} className="group block">
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-100">
      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105" loading="lazy" />
      {product.discount && product.discount > 0 && <span className="absolute top-2 left-2 rounded-full bg-primary-600 px-1.5 py-0.5 text-[10px] font-bold text-white">-{product.discount}%</span>}
    </div>
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-1">
        <img src={product.store.logo} alt="" className="h-4 w-4 rounded-full" />
        <span className="text-[10px] font-medium text-surface-600">{product.store.name}</span>
      </div>
      <h3 className="text-sm font-medium text-surface-900 line-clamp-1">{product.name}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold text-surface-900">${product.price.toLocaleString("es-CO")}</span>
          {product.originalPrice && product.originalPrice > product.price && <span className="text-xs text-surface-500 line-through">${product.originalPrice.toLocaleString("es-CO")}</span>}
        </div>
        {product.rating > 0 && <div className="flex items-center gap-0.5"><Icon name="Star" size={12} color="#F59E0B" /><span className="text-[10px] font-medium">{product.rating}</span></div>}
      </div>
      {product.pointsReward > 0 && <div className="flex items-center gap-0.5"><Icon name="Award" size={12} color="#F59E0B" /><span className="text-[10px] font-medium text-gold-700">+{product.pointsReward} pts Reyvens</span></div>}
    </div>
  </Link>
);

export default ProductCard;
