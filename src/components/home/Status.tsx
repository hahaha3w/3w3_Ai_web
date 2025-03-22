import React from 'react'
import StatusCard from '../common/StatusCard'
import chat from "@/assets/chat.svg"
const AIStatus = () => {
  return (
    <div className='w-full row-center flex-row gap-4'>
      <StatusCard icon={chat} title='聊天' num={32}></StatusCard>
      <StatusCard icon={chat} title='聊天' num={32}></StatusCard>
      <StatusCard icon={chat} title='聊天' num={32}></StatusCard>
    </div>
  )
}

export default AIStatus
