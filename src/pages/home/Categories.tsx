import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoryGrid } from "../../components/common/CategoryGrid";
import { ProductCard } from "../../components/common/ProductCard";
import { Icon } from "../../components/ui/Icon";
import { useCatalogCategories, useCatalogProducts } from "../../hooks/useCatalog";

export const Categories: FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("categoryId");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory || undefined);
  const { categories, isLoading: loadingCategories, error: categoryError, refresh: refreshCategories } = useCatalogCategories();
  const { products, isLoading, error, refresh } = useCatalogProducts({ categoryId: selectedCategory });

  useEffect(() => { setSelectedCategory(initialCategory || undefined); }, [initialCategory]);

  return (
    <div className="min-h-screen bg-surface-50 pb-20">
      <div className="bg-white px-4 py-4"><h1 className="text-xl font-bold text-surface-900">Categorías</h1></div>
      {loadingCategories ? <p role="status" className="p-4 text-sm text-surface-500">Cargando categorías…</p> : categoryError ? (
        <div className="p-4"><p role="alert" className="text-sm text-surface-600">{categoryError}</p><button onClick={() => void refreshCategories()} className="mt-2 text-sm text-primary-600">Intentar de nuevo</button></div>
      ) : <div className="px-4"><CategoryGrid categories={categories} /></div>}
      <div className="px-4"><div className="mb-3 flex gap-2 overflow-x-auto scrollbar-hide">
        <button onClick={() => setSelectedCategory(undefined)} className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${!selectedCategory ? "bg-primary-600 text-white" : "bg-surface-100 text-surface-700"}`}>Todas</button>
        {categories.map(category => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${selectedCategory === category.id ? "bg-primary-600 text-white" : "bg-surface-100 text-surface-700"}`}>{category.name}</button>)}
      </div></div>
      <div className="px-4">
        {isLoading ? <p role="status" className="py-8 text-center text-sm text-surface-500">Cargando productos…</p> : error ? <div className="py-8 text-center"><p role="alert" className="text-sm text-surface-600">{error}</p><button onClick={() => void refresh()} className="mt-2 text-sm text-primary-600">Intentar de nuevo</button></div> : products.length ? <div className="grid grid-cols-2 gap-3">{products.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="py-12 text-center text-surface-500"><Icon name="Search" size={48} color="#D1D5DB" /><p className="mt-2 text-sm">No hay productos en esta categoría.</p></div>}
      </div>
    </div>
  );
};

export default Categories;
