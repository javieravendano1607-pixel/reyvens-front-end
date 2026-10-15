import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa";

const pwaOptions: VitePWAOptions = {
  registerType: "autoUpdate",
  includeAssets: ["robots.txt"],
  manifest: {
    name: "REYVENS - Marketplace Local & Lealtad",
    short_name: "REYVENS",
    description: "El marketplace local de e-commerce y lealtad. Encuentra tiendas cercanas y acumula puntos.",
    theme_color: "#D32F2F",
    background_color: "#FFFFFF",
    display: "standalone",
    orientation: "portrait",
    icons: [
      {
        src: "icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  },
  workbox: {
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.destination === "image",
        handler: "CacheFirst",
        options: {
          cacheName: "images-cache",
          expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(pwaOptions)],
  server: {
    port: 3000,
  },
});
