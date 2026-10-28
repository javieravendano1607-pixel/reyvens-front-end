import type { FC } from "react";
import { LoadingStatus, Skeleton, SkeletonText } from "../ui/Skeleton";

export const ProductGridSkeleton: FC<{ count?: number; label?: string }> = ({ count = 8, label = "Cargando productos" }) => (
  <LoadingStatus label={label}>
    <div aria-hidden="true" className="product-grid">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-surface-200/70 bg-white p-2 sm:p-3">
          <Skeleton className="aspect-[.88/1] rounded-xl" />
          <div className="space-y-3 px-1 pb-1 pt-3">
            <Skeleton className="h-3 w-2/5 rounded-full" />
            <SkeletonText lines={2} />
            <Skeleton className="mt-2 h-5 w-1/2 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </LoadingStatus>
);

export const CategoryGridSkeleton: FC<{ count?: number }> = ({ count = 5 }) => (
  <LoadingStatus label="Cargando categorías">
    <div aria-hidden="true" className="category-grid mb-5 grid grid-cols-2 gap-3 min-[440px]:grid-cols-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="min-w-0">
          <Skeleton className="aspect-[1.16/1] rounded-2xl sm:aspect-[1.12/1]" />
          <Skeleton className="mt-3 h-3.5 w-3/4 rounded-full" />
        </div>
      ))}
    </div>
  </LoadingStatus>
);

export const ProductDetailSkeleton: FC = () => (
  <LoadingStatus label="Cargando producto" className="page-container page-section">
    <div aria-hidden="true" className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-10">
      <Skeleton className="aspect-square rounded-3xl" />
      <div className="space-y-5 py-2">
        <Skeleton className="h-4 w-1/3 rounded-full" />
        <SkeletonText lines={2} className="max-w-lg" />
        <Skeleton className="h-8 w-1/2 rounded-full" />
        <SkeletonText lines={4} />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  </LoadingStatus>
);

export const StorePageSkeleton: FC = () => (
  <LoadingStatus label="Cargando tienda" className="page-container page-section">
    <div aria-hidden="true">
      <Skeleton className="mb-8 h-56 rounded-3xl sm:h-64 lg:h-72" />
      <Skeleton className="mb-5 h-6 w-48 rounded-full" />
      <div className="product-grid">
        {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="aspect-[.88/1] rounded-2xl" />)}
      </div>
    </div>
  </LoadingStatus>
);

export const CartSkeleton: FC = () => (
  <LoadingStatus label="Cargando carrito" className="page-container page-section">
    <div aria-hidden="true" className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex gap-4 rounded-2xl border border-surface-200/70 bg-white p-4">
            <Skeleton className="h-24 w-24 shrink-0 rounded-xl" />
            <div className="flex flex-1 flex-col justify-center gap-3"><Skeleton className="h-4 w-3/4 rounded-full" /><Skeleton className="h-5 w-1/3 rounded-full" /><Skeleton className="h-9 w-28 rounded-lg" /></div>
          </div>
        ))}
      </div>
      <div className="space-y-4 rounded-2xl border border-surface-200/70 bg-white p-5"><Skeleton className="h-5 w-1/2 rounded-full" /><Skeleton className="h-4 w-full rounded-full" /><Skeleton className="h-12 w-full rounded-xl" /><Skeleton className="h-12 w-full rounded-xl" /></div>
    </div>
  </LoadingStatus>
);

export const OrderListSkeleton: FC = () => (
  <LoadingStatus label="Cargando pedidos">
    <div aria-hidden="true" className="grid gap-3 md:grid-cols-2">
      {Array.from({ length: 4 }, (_, index) => <div key={index} className="space-y-4 rounded-2xl border border-surface-200/70 bg-white p-5"><Skeleton className="h-4 w-1/3 rounded-full" /><SkeletonText lines={2} /><Skeleton className="h-5 w-1/2 rounded-full" /></div>)}
    </div>
  </LoadingStatus>
);

export const ReceiptSkeleton: FC = () => (
  <LoadingStatus label="Cargando pedido" className="page-container page-section">
    <div aria-hidden="true" className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.55fr)]">
      <div className="space-y-4"><Skeleton className="h-28 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" /></div>
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  </LoadingStatus>
);

export const SessionSkeleton: FC = () => (
  <LoadingStatus label="Verificando sesión" className="mx-auto flex min-h-72 max-w-5xl items-center px-4 py-8">
    <div aria-hidden="true" className="grid w-full gap-8 md:grid-cols-2 md:items-center"><div className="hidden space-y-4 md:block"><Skeleton className="h-8 w-44 rounded-full" /><SkeletonText lines={3} /></div><div className="mx-auto w-full max-w-lg space-y-4 rounded-2xl border border-surface-200/70 bg-white p-6"><Skeleton className="h-6 w-1/2 rounded-full" /><Skeleton className="h-11 w-full rounded-xl" /><Skeleton className="h-11 w-full rounded-xl" /><Skeleton className="h-11 w-full rounded-xl" /></div></div>
  </LoadingStatus>
);
