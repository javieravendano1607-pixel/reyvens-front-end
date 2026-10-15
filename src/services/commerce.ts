import { api } from "./api";

export interface CartItemDto {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  variantId: string | null;
  variantSku: string | null;
  price: string;
  quantity: number;
  subtotal: string;
  stockQuantity: number | null;
  inventoryTrackingEnabled: boolean;
  isAvailable: boolean;
  availabilityMessage: string | null;
  storeId: string;
  storeName: string;
  storeSlug: string;
}

export interface CartDto {
  items: CartItemDto[];
  subtotal: string;
  totalItems: number;
  groupedByStore: { storeId: string; storeName: string; storeSlug: string; items: CartItemDto[]; storeSubtotal: string }[];
}

export interface AddressDto {
  id: string;
  recipientName: string;
  recipientPhone: string;
  city: string;
  neighborhood: string;
  address: string;
  reference: string | null;
  isDefault: boolean;
}

export interface CreateAddressInput {
  recipientName: string;
  recipientPhone: string;
  city: string;
  neighborhood: string;
  address: string;
  reference?: string;
  isDefault?: boolean;
}

export interface CheckoutOrderDto {
  id: string;
  status: string;
  currency: string;
  subtotal: string;
  deliveryTotal: string;
  discountTotal: string;
  taxTotal: string;
  total: string;
  payment: { id: string; status: string; currency: string; amount: string };
}

export interface OrderListDto {
  id: string;
  status: string;
  currency: string;
  total: string;
  created_at: string;
}

export interface OrderDetailDto extends OrderListDto {
  subtotal: string;
  delivery_total: string;
  discount_total: string;
  tax_total: string;
  shipping_recipient_name: string;
  shipping_recipient_phone: string;
  shipping_city: string;
  shipping_neighborhood: string;
  shipping_address: string;
  shipping_reference: string | null;
  stores: {
    id: string;
    store_id: string;
    store_name_snapshot: string;
    status: string;
    subtotal: string;
    currency: string;
    items: {
      id: string;
      product_name_snapshot: string;
      variant_sku_snapshot: string | null;
      unit_price: string;
      quantity: number;
      line_total: string;
    }[];
  }[];
  payment: { id: string; status: string; currency: string; amount: string } | null;
}

export interface PaymentIntentDto {
  provider: string;
  reference: string;
  currency: string;
  amountInCents: number;
  publicKey: string;
  integritySignature: string;
  checkoutUrl: string;
  checkoutMode: "web";
}

export const commerceApi = {
  cart: () => api.get<CartDto>("/cart"),
  addCartItem: (productId: string, quantity: number, variantId?: string) =>
    api.post<{ item: CartItemDto }>("/cart/items", { productId, quantity, variantId: variantId ?? null }),
  updateCartItem: (id: string, quantity: number) =>
    api.patch<{ item: CartItemDto }>(`/cart/items/${encodeURIComponent(id)}`, { quantity }),
  removeCartItem: (id: string) => api.delete<void>(`/cart/items/${encodeURIComponent(id)}`),
  clearCart: () => api.delete<void>("/cart"),

  addresses: async () => (await api.get<{ addresses: AddressDto[] }>("/addresses")).addresses,
  createAddress: async (input: CreateAddressInput) => (await api.post<{ address: AddressDto }>("/addresses", input)).address,
  updateAddress: async (id: string, input: Partial<CreateAddressInput>) =>
    (await api.patch<{ address: AddressDto }>(`/addresses/${encodeURIComponent(id)}`, input)).address,
  deleteAddress: (id: string) => api.delete<void>(`/addresses/${encodeURIComponent(id)}`),

  checkout: async (addressId: string) => (await api.post<{ order: CheckoutOrderDto }>("/checkout", { addressId })).order,
  paymentIntent: async (paymentId: string) =>
    (await api.post<{ intent: PaymentIntentDto }>(`/payments/${encodeURIComponent(paymentId)}/intent`, {})).intent,
  orders: (page = 1, limit = 20) => api.get<{ data: OrderListDto[]; pagination: { page: number; limit: number; totalPages: number; total: number } }>(`/orders?page=${page}&limit=${limit}`),
  order: (id: string) => api.get<{ order: OrderDetailDto }>(`/orders/${encodeURIComponent(id)}`).then(result => result.order),
};
