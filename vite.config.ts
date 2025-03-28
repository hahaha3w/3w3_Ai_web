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
    proxy: {
      "/api": {
        target: "http://3w.xyq777.org", // 设置为您的后端API服务器地址
        changeOrigin: true, // 改变请求源
        secure: false, // 允许不安全的HTTPS连接
        rewrite: (path) => path, // 不重写路径，保持/api前缀
        // 添加特殊响应头处理
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_, req) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
