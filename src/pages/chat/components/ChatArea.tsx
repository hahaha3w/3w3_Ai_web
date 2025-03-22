import Oml2d from '@/components/Oml2d';
import { Icon } from '@iconify-icon/react/dist/iconify.js';
import { Dropdown, MenuProps } from 'antd';
import { Oml2dEvents, Oml2dMethods, Oml2dProperties } from 'oh-my-live2d';
import { useState } from 'react';

type HeaderProps = {
  title: string
  oml2d: (Oml2dProperties & Oml2dMethods & Oml2dEvents) | null;
}

const Header = ({ title, oml2d }: HeaderProps) => {
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: "切换模型",
      onClick: () => {
        if (oml2d) {
          oml2d.loadNextModel();
        }
      }
    },
  ];
  return (
    <div className='w-full h-[120px] absolute top-0 bg-gradient-to-b from-[rgba(0,0,0,0.2)] to-transparent z-10000 opacity-80'>
      <div className='flex justify-between items-center h-[60px] px-4'>
        <h2 className='text-2xl font-bold mt-0'>{title}</h2>
        <div className='relative inline-block text-left'>
          <Dropdown menu={{ items }} placement="bottomRight">
            <Icon icon="uil:setting" className="text-3xl" />
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

type ChatAreaProps = {
  title: string
}

const ChatArea = ({ title }: ChatAreaProps) => {
  const [oml2d, setOml2d] = useState<(Oml2dProperties & Oml2dMethods & Oml2dEvents) | null>(null);

  return (
    <div className='relative text-gray-50'>
      {/* 修正：正确传递 className 属性 */}
      <Header title={title} oml2d={oml2d} />
      <Oml2d oml2d={oml2d} setOml2d={setOml2d} />
    </div>
  )
}

export default ChatArea
