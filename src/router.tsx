import { createBrowserRouter } from "react-router";
import HomePage from "./pages/home";
import ChatPage from "./pages/chat";
import App from "./App";
import UserPage from "./pages/user";

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
  }
])

export default router;