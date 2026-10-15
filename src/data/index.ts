import type { CarouselBanner, QuickAccessItem } from "./types";
import bannersRaw from "./mock/banners.json";
import quickAccessRaw from "./mock/quickAccess.json";

// These are static presentation/navigation content, not catalog or account data.
export const banners = bannersRaw as CarouselBanner[];
export const quickAccess = quickAccessRaw as QuickAccessItem[];
