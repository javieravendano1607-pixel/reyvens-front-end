import { api } from "./api";
import type { CategoryItem, Product, StoreInfo } from "../data/types";

interface ProductDto {
  id: string;
  store_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  base_price: string;
  compare_at_price: string | null;
  status: string;
  inventory_tracking_enabled: boolean;
  stock_quantity: number;
}

interface ImageDto { url: string; alt_text?: string | null; }
interface VariantDto {
  id: string;
  sku: string;
  price: string;
  stock_quantity: number;
  inventory_tracking_enabled: boolean;
  status: string;
  values: { option_name: string; value: string }[];
}

interface ProductDetailDto {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: string;
    compareAtPrice: string | null;
    inventoryTrackingEnabled: boolean;
    description: string | null;
    images: ImageDto[];
  };
  options: { id: string; name: string; values: { id: string; value: string }[] }[];
  variants: VariantDto[];
}

interface ProductsPage { data: ProductDto[]; pagination: { totalPages: number }; }
interface CategoryDto { id: string; name: string; slug: string; image_url: string | null; children?: CategoryDto[]; }
interface StoreDto {
  id: string; commercialName: string; slug: string; description: string | null;
  logoUrl: string | null; bannerUrl: string | null; categoryId: string | null;
  city: string; deliveryInfo: string | null; status: string;
}

const fallbackImage = "/icons/icon-512.svg";

function productFromSummary(dto: ProductDto): Product {
  const price = Number(dto.base_price);
  const originalPrice = dto.compare_at_price ? Number(dto.compare_at_price) : undefined;
  return {
    id: dto.id,
    slug: dto.slug,
    categoryId: dto.category_id,
    name: dto.name,
    description: dto.description ?? "",
    price,
    originalPrice,
    discount: originalPrice && originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : undefined,
    currency: "COP",
    store: { id: dto.store_id, name: "Tienda local", slug: "", logo: fallbackImage },
    images: [fallbackImage],
    sizes: [],
    colors: [],
    stock: dto.inventory_tracking_enabled ? dto.stock_quantity : null,
    rating: 0,
    reviewCount: 0,
    pointsReward: 0,
    inventoryTrackingEnabled: dto.inventory_tracking_enabled,
    variants: [],
  };
}

export const marketplaceApi = {
  async categories(): Promise<CategoryItem[]> {
    const categories = await api.get<CategoryDto[]>("/categories?status=active");
    return categories.map(category => ({ id: category.id, name: category.name, image: category.image_url || fallbackImage, slug: category.slug }));
  },

  async products(options: { categoryId?: string; storeId?: string; pageSize?: number } = {}): Promise<Product[]> {
    const pageSize = options.pageSize ?? 100;
    const query = new URLSearchParams({ page: "1", limit: String(pageSize), sort: "newest" });
    if (options.categoryId) query.set("categoryId", options.categoryId);
    if (options.storeId) query.set("storeId", options.storeId);
    const first = await api.get<ProductsPage>(`/products?${query.toString()}`);
    const products = [...first.data];
    for (let page = 2; page <= first.pagination.totalPages; page += 1) {
      query.set("page", String(page));
      const result = await api.get<ProductsPage>(`/products?${query.toString()}`);
      products.push(...result.data);
    }
    return products.filter(product => product.status === "active").map(productFromSummary);
  },

  async product(slug: string, signal?: AbortSignal): Promise<Product> {
    const detail = await api.get<ProductDetailDto>(`/products/${encodeURIComponent(slug)}`, signal);
    const images = detail.product.images.map(image => image.url).filter(Boolean);
    const activeVariants = detail.variants.filter(variant => variant.status === "active");
    const trackedStocks = activeVariants
      .filter(variant => variant.inventory_tracking_enabled)
      .map(variant => variant.stock_quantity);
    return {
      id: detail.product.id,
      slug: detail.product.slug,
      name: detail.product.name,
      description: detail.product.description ?? "",
      price: Number(detail.product.basePrice),
      originalPrice: detail.product.compareAtPrice ? Number(detail.product.compareAtPrice) : undefined,
      discount: detail.product.compareAtPrice && Number(detail.product.compareAtPrice) > Number(detail.product.basePrice)
        ? Math.round((1 - Number(detail.product.basePrice) / Number(detail.product.compareAtPrice)) * 100)
        : undefined,
      currency: "COP",
      store: { id: "", name: "Tienda local", slug: "", logo: fallbackImage },
      images: images.length ? images : [fallbackImage],
      stock: trackedStocks.length ? Math.max(...trackedStocks) : null,
      inventoryTrackingEnabled: detail.product.inventoryTrackingEnabled,
      variants: activeVariants,
      sizes: [],
      colors: [],
      rating: 0,
      reviewCount: 0,
      pointsReward: 0,
    };
  },

  async store(slug: string): Promise<StoreInfo> {
    const result = await api.get<{ store: StoreDto }>(`/store/${encodeURIComponent(slug)}`);
    const store = result.store;
    return {
      id: store.id, name: store.commercialName, slug: store.slug,
      logo: store.logoUrl || fallbackImage, banner: store.bannerUrl || undefined,
      category: store.categoryId || undefined, deliveryTime: store.deliveryInfo || "Información de entrega no disponible",
      rating: 0, reviewCount: 0, verified: false,
    };
  },
};
