import { createHashRouter } from "react-router";
import App from "./App";
import ChangePasswordPage from "./pages/auth/changePassword";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ChatPage from "./pages/chat";
import HomePage from "./pages/home";
import UserPage from "./pages/user";
import NotFoundPage from "./pages/404";
import ProtectedRoute from "./components/ProtectedRoute";

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
        element: <ProtectedRoute><UserPage /></ProtectedRoute>
      }
    ]
  },
  {
    path: '/chat',
    element: <ProtectedRoute><ChatPage /></ProtectedRoute>
  },
  {
    path: '/chat/:id',
    element: <ProtectedRoute><ChatPage /></ProtectedRoute>
  },
  {
    path: '/auth/login',
    element: <LoginPage />
  },
  {
    path: '/auth/register',
    element: <RegisterPage />
  },
  {
    path: '/auth/changePassword',
    element: <ChangePasswordPage />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);

export default router;