import { FC } from "react"
import { mockData } from "./ActivityType"
import ActivityCard from "./ActivityCard"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import Api from "@/service/api"
import { ApiKeys } from "@/constants/apiKeys"



const Activity: FC = () => {
  //TODO 最近活动确认一下
  /**
   * 个人建议方案 左上角做个消息Icon 点击后出现小窗可滚动展示最近活动
   */

  const {data, isPending, isError} = useQuery({
    queryKey: [ApiKeys.activityList],
    queryFn: () => Api.activityApi.getActivities()
  })

  

  
  return (
    <div className="w-full h-[600px] p-4 flex flex-col items-start gap-4 ">
      <p className="text-xl font-bold">最近活动(展示最近15条)</p>
      <div className="w-full flex grow flex-col gap-4 overflow-auto">
      {data && data.activities && data.activities.map((item) => {
        return <ActivityCard {...item}></ActivityCard>
      })}

      {isPending && <div>加载中...</div>}
      {isError && <div>加载失败</div>}
      </div>
    </div>
  )
}

export default Activity