/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFF5F5",
          100: "#FFE0E0",
          200: "#FFCCCC",
          300: "#FFA8A8",
          400: "#FF7A7A",
          500: "#FF5252",
          600: "#E53935",
          700: "#D32F2F",
          800: "#C62828",
          900: "#B71C1C",
        },
        gold: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FDBC27",
          400: "#FBBF24",
          500: "#F59E1B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        surface: {
          50: "#FFFFFF",
          100: "#F9FAFB",
          200: "#F3F4F6",
          300: "#E5E7EB",
          400: "#D1D1D1",
          500: "#9CA3AF",
          600: "#6B7280",
          700: "#4B5563",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        geometric: ["'Orbitron'", "sans-serif"],
      },
      boxShadow: {
        "bottom-bar": "0 -2px 12px rgba(0, 0, 0, 0.08)",
        appbar: "0 2px 8px rgba(0, 0, 0, 0.06)",
      },
      maxHeight: {
        "screen-bottom": "calc(100vh - 64px)",
      },
      animation: {
        "bounce-slow": "bounce 2s ease-in-out infinite",
        "pulse-fast": "pulse 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
