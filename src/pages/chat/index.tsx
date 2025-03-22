import { useEffect, useState } from 'react'
import ChatArea from './components/ChatArea'

const ChatPage = () => {
  const [title, setTitle] = useState<string>('Chat Title')

  useEffect(() => {
    setTitle('与猫娘的对话')
  }, [])

  return (
    <div className='w-full'>
      <ChatArea title={title} />
    </div>
  )
}

export default ChatPage
