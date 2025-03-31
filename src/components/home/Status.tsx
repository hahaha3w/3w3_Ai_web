import chat from "@/assets/chat.svg"
import memoir from "@/assets/memoir.svg"
import useDays from "@/assets/useDays.svg"
import StatusCard from '../common/StatusCard'
import { createContext, FC } from "react"
import { UserInfoData } from "@/service/api/user/types"

interface StatusType {
  chat?: number
  memoir?: number
  useDay?: number
  isLoading: boolean
}

export const UserInfoStatusContext = createContext(false);

const AIStatus = (props: StatusType) => {
  return (
    <UserInfoStatusContext.Provider value={props.isLoading}>
      <div className='w-full row-center flex-row gap-5 py-2'>
        <StatusCard icon={chat} title='聊天' num={props.chat} gradient="from-blue-50 to-blue-100"></StatusCard>
        <StatusCard icon={memoir} title='回忆录' num={props.memoir} gradient="from-green-50 to-green-100"></StatusCard>
        <StatusCard icon={useDays} title='使用天数' num={props.useDay} gradient="from-purple-50 to-purple-100"></StatusCard>
      </div>
    </UserInfoStatusContext.Provider>
  )
}

export default AIStatus
