import chat from "@/assets/chat.svg"
import StatusCard from '../common/StatusCard'
import { FC } from "react"
import { UserInfoData } from "@/service/api/user/types"

interface StatusType {
  chat?: number
  memoir?: number
  useDay?: number
}

const AIStatus = (props: StatusType) => {
  return (
    <div className='w-full row-center flex-row gap-4'>
      <StatusCard icon={chat} title='聊天' num={props.chat}></StatusCard>
      <StatusCard icon={chat} title='回忆录' num={props.memoir}></StatusCard>
      <StatusCard icon={chat} title='使用天数' num={props.useDay}></StatusCard>
    </div>
  )
}

export default AIStatus
