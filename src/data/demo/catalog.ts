import type { CategoryItem, Product, StoreInfo } from "../types";

export interface DemoCategory extends CategoryItem {
  demoOnly: true;
  description: string;
  productCount: number;
}

export interface DemoProduct extends Product {
  demoOnly: true;
  categoryId: string;
  categoryName: string;
  tags: string[];
  isNew?: boolean;
}

const image = (name: string) => `/images/demo/catalog/${name}.svg`;
const categoryArtwork: Record<string, string> = {
  Tecnología: "/images/demo/category-tech.svg",
  Calzado: "/images/demo/category-footwear.svg",
  "Ropa y accesorios": "/images/demo/category-apparel.svg",
  "Hogar y ferretería": "/images/demo/category-home.svg",
  "Belleza y cuidado": "/images/demo/category-care.svg",
};

const store = (id: string, name: string, slug: string, category: string): StoreInfo => ({
  id: `demo-store-${id}`,
  name,
  slug: `demo-store-${slug}`,
  logo: categoryArtwork[category],
  banner: categoryArtwork[category],
  category,
  rating: 4.7,
  reviewCount: 18 + id.length * 3,
  deliveryTime: "Entrega ilustrativa",
  verified: false,
});

export const demoCategories: DemoCategory[] = [
  { id: "demo-category-tech", slug: "tecnologia", name: "Tecnología", image: "/images/demo/category-tech.svg", demoOnly: true, description: "Audio, accesorios y esenciales digitales", productCount: 4 },
  { id: "demo-category-footwear", slug: "calzado", name: "Calzado", image: "/images/demo/category-footwear.svg", demoOnly: true, description: "Piezas cómodas para todos los días", productCount: 4 },
  { id: "demo-category-style", slug: "ropa-accesorios", name: "Ropa y accesorios", image: "/images/demo/category-apparel.svg", demoOnly: true, description: "Detalles que acompañan tu estilo", productCount: 4 },
  { id: "demo-category-home", slug: "hogar-ferreteria", name: "Hogar y ferretería", image: "/images/demo/category-home.svg", demoOnly: true, description: "Objetos útiles para tus espacios", productCount: 4 },
  { id: "demo-category-care", slug: "cuidado-personal", name: "Belleza y cuidado", image: "/images/demo/category-care.svg", demoOnly: true, description: "Rutinas simples de cuidado personal", productCount: 4 },
];

const stores = {
  byte: store("byte", "Casa Byte", "casa-byte", "Tecnología"),
  pulso: store("pulso", "Pulso Audio", "pulso-audio", "Tecnología"),
  paso: store("paso", "Buen Paso", "buen-paso", "Calzado"),
  trama: store("trama", "Trama Local", "trama-local", "Ropa y accesorios"),
  casa: store("casa", "Casa Elemento", "casa-elemento", "Hogar y ferretería"),
  claro: store("claro", "Claro Día", "claro-dia", "Belleza y cuidado"),
};

const product = (
  id: string,
  name: string,
  categoryId: string,
  categoryName: string,
  price: number,
  storeInfo: StoreInfo,
  tags: string[],
  options: Partial<DemoProduct> & { description: string },
): DemoProduct => ({
  id: `demo-product-${id}`,
  slug: `demo-product-${id}`,
  name,
  description: options.description,
  price,
  ...(options.originalPrice ? { originalPrice: options.originalPrice, discount: Math.round((1 - price / options.originalPrice) * 100) } : {}),
  currency: "COP",
  store: storeInfo,
  images: [image(id)],
  sizes: [],
  colors: [],
  stock: null,
  rating: Number((4.4 + (id.length % 5) / 10).toFixed(1)),
  reviewCount: 12 + id.length * 2,
  pointsReward: 0,
  inventoryTrackingEnabled: false,
  tags,
  demoOnly: true,
  categoryId,
  categoryName,
  ...(options.isNew ? { isNew: true } : {}),
  ...(options.variants ? { variants: options.variants.map(variant => ({ ...variant, price: String(price) })) } : {}),
});

const sizeVariants = [36, 37, 38, 39, 40].map(size => ({
  id: `demo-variant-size-${size}`,
  sku: `DEMO-SIZE-${size}`,
  price: "0",
  stock_quantity: 0,
  inventory_tracking_enabled: false,
  values: [{ option_name: "Talla", value: String(size) }],
}));

export const demoProducts: DemoProduct[] = [
  product("phone", "Teléfono Nova 128 GB", "demo-category-tech", "Tecnología", 899900, stores.byte, ["Destacado"], { description: "Un teléfono de muestra con pantalla amplia, acabado mate y espacio para lo esencial.", originalPrice: 999900, isNew: true }),
  product("headphones", "Audífonos Pulse inalámbricos", "demo-category-tech", "Tecnología", 189900, stores.pulso, ["Popular"], { description: "Audio inalámbrico de demostración con estuche compacto y controles sencillos." }),
  product("speaker", "Parlante portátil Senda", "demo-category-tech", "Tecnología", 249900, stores.pulso, ["Nuevo"], { description: "Un parlante portátil ficticio pensado para acompañar espacios cotidianos.", isNew: true }),
  product("watch", "Reloj inteligente Ruta", "demo-category-tech", "Tecnología", 329900, stores.byte, ["Destacado"], { description: "Reloj de muestra con correa intercambiable y pantalla de lectura clara." }),
  product("sneaker", "Tenis urbanos Brisa", "demo-category-footwear", "Calzado", 219900, stores.paso, ["Popular"], { description: "Tenis de demostración con silueta ligera y suela cómoda para el día a día.", variants: sizeVariants }),
  product("sandal", "Sandalia Nube", "demo-category-footwear", "Calzado", 119900, stores.paso, ["Nuevo"], { description: "Sandalia ficticia de líneas simples, creada para esta vista de catálogo.", isNew: true, variants: sizeVariants }),
  product("boot", "Bota corta Sendero", "demo-category-footwear", "Calzado", 289900, stores.paso, ["Destacado"], { description: "Bota de muestra con acabado sobrio y detalles en contraste.", variants: sizeVariants }),
  product("sneaker-light", "Tenis Lino esencial", "demo-category-footwear", "Calzado", 199900, stores.paso, ["Edición demo"], { description: "Una segunda silueta de calzado ficticio para explorar el catálogo.", originalPrice: 239900, variants: sizeVariants }),
  product("jacket", "Chaqueta liviana Horizonte", "demo-category-style", "Ropa y accesorios", 259900, stores.trama, ["Destacado"], { description: "Chaqueta de muestra con corte relajado y bolsillos funcionales.", isNew: true }),
  product("bag", "Bolso diario Pliegue", "demo-category-style", "Ropa y accesorios", 149900, stores.trama, ["Popular"], { description: "Bolso ficticio de uso diario, con espacio para llevar tus esenciales." }),
  product("shirt", "Camisa algodón Alba", "demo-category-style", "Ropa y accesorios", 129900, stores.trama, ["Nuevo"], { description: "Camisa de demostración con una silueta cómoda y tejido ligero.", isNew: true }),
  product("cap", "Gorra clásica Norte", "demo-category-style", "Ropa y accesorios", 69900, stores.trama, ["Edición demo"], { description: "Accesorio ficticio de líneas limpias para completar el conjunto." }),
  product("lamp", "Lámpara de mesa Lumbre", "demo-category-home", "Hogar y ferretería", 179900, stores.casa, ["Destacado"], { description: "Lámpara decorativa de demostración con luz cálida y base estable.", originalPrice: 209900 }),
  product("drill", "Taladro compacto Taller", "demo-category-home", "Hogar y ferretería", 319900, stores.casa, ["Popular"], { description: "Herramienta eléctrica ficticia presentada únicamente para el prototipo." }),
  product("chair", "Silla auxiliar Orilla", "demo-category-home", "Hogar y ferretería", 279900, stores.casa, ["Nuevo"], { description: "Silla de muestra con estructura sencilla y asiento cómodo.", isNew: true }),
  product("pan", "Sartén de hierro Claro", "demo-category-home", "Hogar y ferretería", 139900, stores.casa, ["Edición demo"], { description: "Pieza de cocina ficticia para ilustrar la variedad del mercado local." }),
  product("serum", "Sérum facial Calma", "demo-category-care", "Belleza y cuidado", 89900, stores.claro, ["Nuevo"], { description: "Producto de cuidado personal ficticio. No corresponde a una marca comercial real.", isNew: true }),
  product("cream", "Crema hidratante Día", "demo-category-care", "Belleza y cuidado", 74900, stores.claro, ["Popular"], { description: "Crema de demostración con una presentación serena y minimalista." }),
  product("sunscreen", "Protector solar Horizonte", "demo-category-care", "Belleza y cuidado", 109900, stores.claro, ["Destacado"], { description: "Producto ficticio para mostrar una tarjeta de cuidado personal." }),
  product("dryer", "Secador compacto Aura", "demo-category-care", "Belleza y cuidado", 159900, stores.claro, ["Edición demo"], { description: "Accesorio ficticio con formato compacto para esta demostración visual." }),
];

export const demoStores = Object.values(stores);

export const getDemoProduct = (id: string): DemoProduct | undefined =>
  demoProducts.find(item => item.id === id || item.slug === id);

export const getDemoStore = (id: string): StoreInfo | undefined =>
  demoStores.find(item => item.id === id || item.slug === id);

export const getDemoCategory = (id: string): DemoCategory | undefined =>
  demoCategories.find(item => item.id === id || item.slug === id);

export const demoSearchText = (item: DemoProduct): string =>
  `${item.name} ${item.description} ${item.store.name} ${item.categoryName} ${item.tags.join(" ")}`;
