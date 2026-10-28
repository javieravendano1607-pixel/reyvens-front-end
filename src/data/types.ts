export interface ColorOption {
  name: string;
  value: string;
  hex: string;
}

export interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  logo: string;
  logoAlt?: string;
  banner?: string;
  category?: string;
  subcategories?: string[];
  rating?: number;
  reviewCount?: number;
  deliveryTime?: string;
  deliveryFee?: number;
  isFavorite?: boolean;
  verified?: boolean;
}

export interface Product {
  id: string;
  slug?: string;
  categoryId?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  store: StoreInfo;
  images: string[];
  sizes: string[];
  colors: ColorOption[];
  stock: number | null;
  rating: number;
  reviewCount: number;
  pointsReward: number;
  inventoryTrackingEnabled?: boolean;
  variants?: {
    id: string;
    sku: string;
    price: string;
    stock_quantity: number;
    inventory_tracking_enabled: boolean;
    values: { option_name: string; value: string }[];
  }[];
}

export interface CarouselBanner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  bgColor: string;
  textColor: string;
  image: string;
  link: string;
}

export interface QuickAccessItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  link: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  slug?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string | null;
  color?: string;
  store: { id: string; name: string; logo?: string };
  image: string;
}

export interface Order {
  id: string;
  date: string;
  dateFull: string;
  status: string;
  statusColor: string;
  total: number;
  currency: string;
  items: OrderItem[];
  pointsEarned: number;
  paymentMethod: string;
}

export interface RewardLevel {
  id: string;
  name: string;
  minPoints: number;
  color: string;
  icon: string;
  benefits: string[];
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  points: number;
  image: string;
  available: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  completed: boolean;
  available: boolean;
}

