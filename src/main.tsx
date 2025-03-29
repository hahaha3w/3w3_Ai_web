import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19';
import './index.css'
import { RouterProvider } from 'react-router'
import router from './router'
import { App, ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <App >
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <RouterProvider router={router} />
      </ConfigProvider>
    </QueryClientProvider>
  </App>
)