import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoryGrid } from "../../components/common/CategoryGrid";
import { ProductGrid } from "../../components/common/ProductGrid";
import { Icon } from "../../components/ui/Icon";
import { useCatalogCategories, useCatalogProducts } from "../../hooks/useCatalog";
import { CategoryGridSkeleton, ProductGridSkeleton } from "../../components/common/LoadingPatterns";

export const Categories: FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("categoryId");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory || undefined);
  const { categories, isLoading: loadingCategories, error: categoryError, refresh: refreshCategories } = useCatalogCategories();
  const { products, isLoading, error, refresh } = useCatalogProducts({ categoryId: selectedCategory });
  useEffect(() => { setSelectedCategory(initialCategory || undefined); }, [initialCategory]);

  return (
    <div className="page-container page-section">
      <div className="page-heading"><p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary-800">Catálogo</p><h1 className="page-title">Categorías</h1><p className="max-w-2xl text-sm text-surface-600">Explora los productos disponibles por categoría.</p></div>
      {loadingCategories ? <CategoryGridSkeleton count={5} /> : categoryError ? <div className="surface-card p-5"><p role="alert" className="text-sm text-surface-700">{categoryError}</p><button type="button" onClick={() => void refreshCategories()} className="mt-2 min-h-10 rounded-lg px-3 text-sm font-semibold text-primary-800 hover:bg-primary-50">Intentar de nuevo</button></div> : <CategoryGrid categories={categories} />}

      <div className="mb-5 mt-7 flex flex-wrap gap-2" role="group" aria-label="Filtrar productos por categoría">
        <button type="button" aria-pressed={!selectedCategory} onClick={() => setSelectedCategory(undefined)} className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${!selectedCategory ? "border-primary-800 bg-primary-800 text-white" : "border-surface-300 bg-white text-surface-700 hover:border-surface-500"}`}>Todas</button>
        {categories.map(category => <button type="button" aria-pressed={selectedCategory === category.id} key={category.id} onClick={() => setSelectedCategory(category.id)} className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${selectedCategory === category.id ? "border-primary-800 bg-primary-800 text-white" : "border-surface-300 bg-white text-surface-700 hover:border-surface-500"}`}>{category.name}</button>)}
      </div>

      <section aria-label="Productos">
        {isLoading ? <ProductGridSkeleton count={8} /> : error ? <div className="surface-card py-10 text-center"><p role="alert" className="text-sm text-surface-700">{error}</p><button type="button" onClick={() => void refresh()} className="mt-2 min-h-10 rounded-lg px-3 text-sm font-semibold text-primary-800 hover:bg-primary-50">Intentar de nuevo</button></div> : products.length ? <ProductGrid products={products} /> : <div className="surface-card py-12 text-center text-surface-600"><Icon name="Search" size={40} /><p className="mt-2 text-sm">No hay productos en esta categoría.</p></div>}
      </section>
    </div>
  );
};

export default Categories;
