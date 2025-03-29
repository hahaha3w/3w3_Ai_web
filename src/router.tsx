import { createHashRouter } from "react-router";
import App from "./App";
import ChangePasswordPage from "./pages/auth/changePassword"; // 新增的导入
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register"; // 新增的导入
import ChatPage from "./pages/chat";
import HomePage from "./pages/home";
import UserPage from "./pages/user";

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/user',
        element: <UserPage />
      }
    ]
  },
  {
    path: '/chat',
    element: <ChatPage />
  },
  {
    path: '/chat/:id', // 添加带有ID参数的聊天路由
    element: <ChatPage />
  },
  {
    path: '/auth/login',
    element: <LoginPage />
  },
  {
    path: '/auth/register', // 新增的路径
    element: <RegisterPage />
  },
  {
    path: '/auth/changePassword', // 新增的路径
    element: <ChangePasswordPage />
  }
]);

export default router;