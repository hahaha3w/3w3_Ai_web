import Oml2d from '@/components/Oml2d';
import { Bubble, Sender } from '@ant-design/x';

import { Icon } from '@iconify-icon/react/dist/iconify.js';
import { ConfigProvider, Dropdown, GetProp, GetRef, MenuProps, theme, Tooltip } from 'antd';
import { Oml2dEvents, Oml2dMethods, Oml2dProperties } from 'oh-my-live2d';
import React, { useRef, useState } from 'react';
import styles from './ChatArea.module.scss';

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
    {
      key: '2',
      label: "你好，猫娘",
      onClick: () => {
        oml2d?.tipsMessage("你才是猫娘，你全家都是猫娘！", 3000, 1);
      }
    },
  ];
  return (
    <div className='w-full h-[120px] absolute top-0 bg-gradient-to-b from-[rgba(0,0,0,0.2)] to-transparent z-10001 opacity-80'>
      <div className='flex justify-between items-center h-[60px] px-4'>
        <h2 className='text-2xl font-bold mt-0'>{title}</h2>
        <div className='relative inline-block text-left'>
          <Dropdown trigger={['click']} overlayClassName="chat-area-settings" menu={{ items }} placement="bottomRight" dropdownRender={(menus) => {
            return (
              <div className={styles.menu}>{menus}</div>
            )
          }}>
            <Icon icon="uil:setting" className="text-3xl" />
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

const rolesAsObject: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: 600,
    },
    shape: 'round',
    styles: {
      content: {
        color: 'white',
        background: 'rgba(0,0,0,0.5)',
      }
    },
  },
  user: {
    placement: 'end',
    shape: 'round',
    styles: {
      content: {
        color: 'white',
        background: 'rgba(0,0,0,0.5)',
      }
    },
  },
};

const MessageList: React.FC = () => {
  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className='w-full h-full box-border flex justify-end flex-col top-0 absolute p-4  z-10000'>
      <Bubble.List
        ref={listRef}
        style={{ maxHeight: 300 }}
        roles={rolesAsObject}
        items={[
          { key: 1, role: 'ai', content: "我是可爱的小猫咪，喵喵喵~" },
          { key: 1, role: 'user', content: "你好，猫娘" },
          { key: 1, role: 'ai', content: "你才是猫娘，你全家都是猫娘！" },
        ]}
      />
      <Sender
        value={value}
        onChange={setValue}
        loading={loading}
        onSubmit={() => {
          setValue('');
          setLoading(true);
        }}
        placeholder='聊点什么呢？'
        onCancel={() => {
          setLoading(false);
        }}
        actions={(_, info) => {
          const { SendButton } = info.components;

          if (loading) {
            return (
              <Tooltip title="Sending...">
                <SendButton />
              </Tooltip>
            );
          }

          return (
            <Tooltip title={value ? 'Send \u21B5' : 'Please type something'}>
              <SendButton />
            </Tooltip>
          );
        }}
      />
    </div>
  )
}

type ChatAreaProps = {
  title: string
}

const ChatArea = ({ title }: ChatAreaProps) => {
  const [oml2d, setOml2d] = useState<(Oml2dProperties & Oml2dMethods & Oml2dEvents) | null>(null);

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className='relative text-gray-50'>
        {/* 修正：正确传递 className 属性 */}
        <Header title={title} oml2d={oml2d} />
        <Oml2d oml2d={oml2d} setOml2d={setOml2d} />
        <MessageList />
      </div>
    </ConfigProvider>
  )
}

export default ChatArea
