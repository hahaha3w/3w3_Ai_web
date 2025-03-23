import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  base: process.env.VITE_APP_BASE_URL, // 使用 Vite 提供的环境变量设置 base URL
  server: {
    port: parseInt(process.env.VITE_APP_PORT || "5173"), // 使用 Vite 提供的环境变量设置端口
  },
});
