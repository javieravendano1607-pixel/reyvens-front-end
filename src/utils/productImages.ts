export interface ProductImageDto {
  url?: string | null;
  alt_text?: string | null;
  is_primary?: boolean | number | null;
  sort_order?: number | null;
}

const PLACEHOLDER = "/icons/icon-512.svg";

function toBool(value: boolean | number | null | undefined): boolean {
  return value === true || value === 1;
}

/** Resolve a product image URL. Relative /images/... or /public/images/... paths are resolved against the API origin (VITE_API_BASE_URL). */
export function resolveProductImageUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return trimmed;

  const configuredBase = (import.meta as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL?.trim()?.replace(/\/$/, "");
  if (configuredBase) {
    try {
      const origin = new URL(configuredBase).origin;
      return new URL(trimmed.startsWith("/") ? trimmed : `/${trimmed}`, origin).toString();
    } catch {
      return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    }
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/** Pick the best image URL from a product.images[] array (primary first, then sort_order). */
export function pickProductImageUrl(images: ProductImageDto[] | null | undefined): string | null {
  if (!images?.length) return null;
  const resolved = images
    .filter((img) => img?.url)
    .map((img) => ({
      ...img,
      resolved: resolveProductImageUrl(img.url),
      isPrimary: toBool(img.is_primary),
      sort: typeof img.sort_order === "number" ? img.sort_order : 0,
    }))
    .filter((img) => img.resolved);
  if (!resolved.length) return null;
  const primary = resolved.find((img) => img.isPrimary);
  if (primary) return primary.resolved!;
  const sorted = [...resolved].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  return sorted[0]?.resolved ?? null;
}

/** Return a stable image list for a product: primary/sorted real images, or [placeholder]. */
export function getProductImageUrls(images: ProductImageDto[] | null | undefined): string[] {
  if (!images?.length) return [PLACEHOLDER];
  const resolved = images
    .filter((img) => img?.url)
    .map((img) => ({
      ...img,
      resolved: resolveProductImageUrl(img.url),
      isPrimary: toBool(img.is_primary),
      sort: typeof img.sort_order === "number" ? img.sort_order : 0,
    }))
    .filter((img) => img.resolved && !img.resolved!.endsWith(PLACEHOLDER));
  if (!resolved.length) return [PLACEHOLDER];
  const sorted = [...resolved].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return (a.sort ?? 0) - (b.sort ?? 0);
  });
  return sorted.map((img) => img.resolved!);
}
