import { useState } from 'react'
import ChatArea from './components/ChatArea'

const ChatPage = () => {
  const [title, setTitle] = useState<string>('Chat Title')
  return (
    <div className='w-full'>
      <ChatArea title={title} />
    </div>
  )
}

export default ChatPage
