import { FC } from "react";
import type { Product } from "../../data/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid: FC<ProductGridProps> = ({ products }) => (
  <div className="product-grid">
    {products.map(product => <ProductCard key={product.id} product={product} />)}
  </div>
);
