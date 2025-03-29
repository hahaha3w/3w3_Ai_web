import { useTokenStore } from "@/store/token";
import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL, // 开发环境使用 /api，生产环境使用环境变量配置的 API 基础 URL
  timeout: parseInt(import.meta.env.VITE_SERVICE_TIMEOUT || "5000"), // 使用 Vite 提供的环境变量设置请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前添加 token 或其他自定义逻辑
    const token = useTokenStore.getState().token
    console.log(`get success Token ${token}`)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 处理成功的响应
    if (typeof response.data === "string") {
      try {
        const data = JSON.parse(response.data);
        console.log("API 响应数据:", data);
        return data;
      } catch (error) {
        console.warn("API 响应数据无法解析为 JSON:", error);
        return response.data;
      }
    }
    return response.data;
  },
  (error) => {
    // 处理响应错误
    console.error("API 错误:", error.response || error.message);
    return Promise.reject(error);
  }
);

export { http };
