import { createBrowserRouter } from "react-router";
import HomePage from "./pages/home";
import ChatPage from "./pages/chat";
import App from "./App";
import UserPage from "./pages/user";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register"; // 新增的导入
import ChangePasswordPage from "./pages/auth/changePassword"; // 新增的导入

const router = createBrowserRouter([
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