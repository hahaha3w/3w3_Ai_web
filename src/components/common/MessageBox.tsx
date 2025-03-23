import { FC } from "react"
import { mockData } from "../home/Activity/ActivityType"
import MessageCard from "./MessageCard"



const MessageBox: FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start gap-2 bg-white rounded-2xl p-4 shadow ">
      {/* Title */}
      <div className="w-full flex flex-row justify-between items-center">
        <div className="text-base font-semibold">互动消息</div>
        {/**TODO 筛选 */}
      </div>
      <div className="w-full flex flex-col justify-start items-center gap-2 overflow-auto ">
        {mockData.map((data) => {
          return <MessageCard {...data}></MessageCard>
        })}
      </div>
     
    </div>
  )
}
export default MessageBox