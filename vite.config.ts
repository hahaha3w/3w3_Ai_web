import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default ({ mode }: { mode: string }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd());

  console.log("env", env);

  return defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    base: env.VITE_APP_BASE_URL, // 使用加载的环境变量设置 base URL
    server: {
      port: parseInt(env.VITE_APP_PORT || "5173"), // 使用加载的环境变量设置端口
      proxy: {
        "/api": {
          target: env.VITE_SERVICE_PROXY_URL, // 使用加载的环境变量设置后端API服务器地址
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path, // 不重写路径，保持/api前缀
          configure: (proxy) => {
            proxy.on("error", (err) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (_, req) => {
              console.log("Sending Request to the Target:", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req) => {
              console.log("Received Response from the Target:", proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
  });
};
