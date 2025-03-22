import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19';
import './index.css'
import { RouterProvider } from 'react-router'
import router from './router'
import { App, ConfigProvider } from 'antd';

createRoot(document.getElementById('root')!).render(
  <App >
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  </App>
)