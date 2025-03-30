import { FC, use, useEffect } from "react"
import { mockData } from "../home/Activity/ActivityType"
import MessageCard from "./MessageCard"
import { ApiKeys } from "@/constants/apiKeys"
import Api from "@/service/api"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { Empty } from "antd"
import InfiniteScroll from "react-infinite-scroll-component"
import { useRefetchStore } from "@/store/refetch"



const MessageBox: FC = () => {
  const {setRefetchActionList} = useRefetchStore()
  const {data, status, error, refetch, fetchNextPage, isRefetching} = useInfiniteQuery({
    queryKey: [ApiKeys.activityList],
    queryFn: ({pageParam = 1}) => Api.activityApi.getActivities(pageParam, 5),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (!lastPage.activities || !lastPage?.activities?.length) return undefined
      return lastPageParam + 1
    }
  })

  useEffect(() => {
    setRefetchActionList(refetch)
  },[refetch, setRefetchActionList])

  return (
    <div className="w-full h-full flex flex-col items-center justify-start gap-2 bg-white rounded-2xl p-4 shadow ">
      {/* Title */}
      <div className="w-full flex flex-row justify-between items-center">
        <div className="text-base font-semibold">互动消息</div>
      </div>
      <div className="grow-0 overflow-scroll" id="message_box_id">
        {status == 'pending' && <div className="w-full text-center m-auto">加载中...</div>}
        {status == 'error' && <div className="w-full text-center m-auto">加载失败</div>}
        {data && data.pages[0]?.activities && 
          data.pages[0].activities.length > 0
        ? <InfiniteScroll
          className="h-full"
          hasMore={data.pages[data.pages.length - 1].hasMore}
          dataLength={data?.pages.reduce((total, page) => total + page.activities.length, 0) || 0}
          next={() => {
            console.log("refetch next")
            if(!isRefetching) fetchNextPage()
          }}
          refreshFunction={()=> {if(!isRefetching)refetch()}}
          loader = {
            <div className="w-full text-center m-auto">loading...</div>
          }
          endMessage = {
            <div className="w-full row-center text-sm text-gray-400">之后没有活动了哦~</div>
          }
          scrollableTarget = "message_box_id"
        >
          <div className="w-full flex flex-col justify-start items-center gap-2 overflow-scroll">
          {
            data.pages.map((innerData) => {
              return innerData.activities.map((item) => <MessageCard {...item}></MessageCard>)
            })
          }
          </div>
        </InfiniteScroll>
        
        : <Empty
          description = "暂无消息"
        ></Empty>
        }
      </div>
     
    </div>
  )
}
export default MessageBox