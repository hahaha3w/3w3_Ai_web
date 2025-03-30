import { FC } from "react"
import { mockData } from "../home/Activity/ActivityType"
import MessageCard from "./MessageCard"
import { ApiKeys } from "@/constants/apiKeys"
import Api from "@/service/api"
import { useQuery } from "@tanstack/react-query"
import { Empty } from "antd"



const MessageBox: FC = () => {
  const {data, status} = useQuery({
    queryKey: [ApiKeys.activityList], 
    queryFn: () => Api.activityApi.getActivities(),
  })
  return (
    <div className="w-full h-full flex flex-col items-center justify-start gap-2 bg-white rounded-2xl p-4 shadow ">
      {/* Title */}
      <div className="w-full flex flex-row justify-between items-center">
        <div className="text-base font-semibold">互动消息</div>
      </div>
      <div className="w-full flex flex-col justify-start items-center gap-2 overflow-auto ">
        {data && data.activities && 
          data.activities.length != 0 
        ? data.activities.map((item) => {
          return <MessageCard {...item}></MessageCard>
        })
        : <Empty
          description = "暂无消息"
        ></Empty>
        }
      </div>
     
    </div>
  )
}
export default MessageBox