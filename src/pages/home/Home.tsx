import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components/common/Logo";
import { BannerCarousel } from "../../components/common/BannerCarousel";
import { QuickAccessGrid } from "../../components/common/CategoryGrid";
import { ProductCard } from "../../components/common/ProductCard";
import { Icon } from "../../components/ui/Icon";
import { Modal } from "../../components/ui/Modal";
import { banners, quickAccess } from "../../data";
import { useCatalogProducts } from "../../hooks/useCatalog";

export const Home: FC = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { products, isLoading, error, refresh } = useCatalogProducts();
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          <button onClick={() => setShowLocationModal(true)} className="flex items-center gap-1 text-left">
            <Icon name="MapPin" size={16} color="#6B7280" />
            <span className="text-sm font-medium text-surface-700">Ubicación</span>
            <Icon name="ChevronDown" size={14} color="#9CA3AF" />
          </button>
        </div>
      </div>
      <div className="px-4 pt-2"><BannerCarousel banners={banners} /></div>
      <div className="px-4"><QuickAccessGrid items={quickAccess} /></div>
      <div className="px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-surface-900">PARA TI</h2>
          <Link to="/categories" className="text-xs font-medium text-primary-600">Ver catálogo</Link>
        </div>
        {isLoading ? <p role="status" className="py-8 text-center text-sm text-surface-500">Cargando catálogo…</p> : error ? (
          <div className="py-8 text-center"><p role="alert" className="text-sm text-surface-600">{error}</p><button onClick={() => void refresh()} className="mt-2 text-sm font-medium text-primary-600">Intentar de nuevo</button></div>
        ) : products.length ? <div className="grid grid-cols-2 gap-3">{products.slice(0, 20).map(product => <ProductCard key={product.id} product={product} />)}</div> : <p className="py-8 text-center text-sm text-surface-500">Aún no hay productos publicados.</p>}
      </div>
      <div className="h-20" />
      <Modal isOpen={showLocationModal} onClose={() => setShowLocationModal(false)} title="Ubicación" size="sm">
        <p className="text-sm text-surface-600">La selección de ciudad todavía no está conectada. La dirección guardada se solicita al realizar el checkout.</p>
      </Modal>
    </div>
  );
};

export default Home;
