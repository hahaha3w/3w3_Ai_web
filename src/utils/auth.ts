// 存储 token 到 localStorage
export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

// 从 localStorage 获取 token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// 清除 localStorage 中的 token
export const clearToken = () => {
  localStorage.removeItem('token');
};

// 检查用户是否已登录
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
