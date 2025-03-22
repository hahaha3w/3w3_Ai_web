import Oml2d from '@/components/Oml2d';
import { Dropdown, MenuProps } from 'antd';

type HeaderProps = {
  title: string
}

const Header = ({ title }: HeaderProps) => {
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item
        </a>
      ),
    },
  ];
  return (
    <div className='w-full h-[120px] absolute top-0 bg-gradient-to-b from-[rgba(0,0,0,0.2)] to-transparent z-10000'>
      <div className='flex justify-between items-center h-[60px] px-4'>
        <h2 className='text-white text-2xl font-bold mt-0'>{title}</h2>
        <div className='relative inline-block text-left'>
          <Dropdown menu={{ items }} placement="bottomRight">
            {/* <Button ghost icon={<Icon icon={} />}></Button> */}
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
  return (
    <div className='relative'>
      {/* 修正：正确传递 className 属性 */}
      <Header title={title} />
      <Oml2d />
    </div>
  )
}

export default ChatArea
