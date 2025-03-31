import React from 'react';
import { Button, Tooltip } from 'antd';
import { Icon } from '@iconify-icon/react/dist/iconify.js';

interface SidebarHeaderProps {
  onClose: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <h2 className="text-xl text-gray-800 font-bold m-0">心忆灵伴</h2>
      <div className="flex gap-2">
        <Tooltip title="返回主页">
          <Button
            type="text"
            icon={<Icon icon="mdi:home" className="text-gray-600" />}
            onClick={() => (window.location.href = "/")}
            className="border-0 shadow-none"
          />
        </Tooltip>
        <Tooltip title="关闭侧边栏">
          <Button
            type="text"
            icon={<Icon icon="mdi:close" className="text-gray-600" />}
            onClick={onClose}
            className="lg:hidden border-0 shadow-none"
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default SidebarHeader;
