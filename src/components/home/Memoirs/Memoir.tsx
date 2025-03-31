import { FC, useEffect, useState } from "react"
import MemoirCard from "./MemoirCard"
import { memoirsMockData } from "./MemoirType"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import Api from "@/service/api"
import { Empty, Skeleton, Spin } from "antd"
import { LoadingOutlined } from '@ant-design/icons';
import { useRefetchStore } from "@/store/refetch"
import InfiniteScroll from 'react-infinite-scroll-component';
import { ApiKeys } from "@/constants/apiKeys"


const Memoir: FC = () => {
  const {setRefetchMemoirList} = useRefetchStore()

  const {data, status, error, refetch, fetchNextPage, isRefetching} = useInfiniteQuery({
    queryKey: [ApiKeys.memoirList],
    queryFn: ({pageParam = 1}) => Api.memoirApi.getMemoirList(pageParam, 12),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (!lastPage.memoirs.length) return undefined
      return lastPageParam + 1
    }
  })

  useEffect(() => {
    console.log(data)
  }, [data])

  useEffect(() => {
    setRefetchMemoirList(refetch)
  }, [refetch, setRefetchMemoirList])
  return (
    <div className="w-full h-[600px] p-6 flex flex-col items-start gap-5 bg-white rounded-2xl shadow-md">
      <p className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2">我的回忆录</p>
        {status === 'pending' && 
          <div className="w-full h-[480px] flex items-center justify-center">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 60, color: '#1890ff' }} spin></LoadingOutlined>} size="large" /> 
          </div>
        }
        { data ? 
          <div className="h-[520px] overflow-auto w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" id="scrollable_memoir_list">
            <InfiniteScroll
              className="w-full"
              dataLength={data?.pages.reduce((total, page) => total + page.memoirs.length, 0) || 0}
              next={() => {
                console.log("refetch next")
                if(!isRefetching) fetchNextPage()
              }}
              hasMore={data.pages[data.pages.length - 1].hasMore}
              refreshFunction={()=> {if(!isRefetching)refetch()}}
              pullDownToRefresh
              pullDownToRefreshThreshold={50}
              loader = {
              <div className="w-full flex flex-row justify-around gap-4 p-4">
                <Skeleton.Node style={{
                  width: '30%',
                  height: 150,
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }} active>
                </Skeleton.Node>
                <Skeleton.Node  style={{
                  width: '30%',
                  height: 150,
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }} active />
                <Skeleton.Node style={{
                  width: '30%',
                  height: 150,
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }} active />
              </div>}
              endMessage = {
                <div className="w-full py-6 text-center text-sm text-gray-500 italic">没有更多回忆录了，快去创建新的回忆吧~</div>
              }
              scrollableTarget="scrollable_memoir_list"
            >
              
                { data.pages[0].memoirs.length != 0 
                  ? 
                  <div className="w-full p-4 grid grid-flow-row grid-cols-3 gap-4">
                    {
                    data.pages.map(memoirList => {
                      return memoirList.memoirs.map((item) => <MemoirCard {...item} id={item.id}></MemoirCard>)
                    })
                  }
                  </div>
                  : 
                  <div className="w-full h-[400px] flex items-center justify-center">
                    <Empty description={<span className="text-gray-500">暂无回忆录，开始创建你的第一个吧！</span>}/>
                  </div>
                }
            </InfiniteScroll>
          </div>
          : null
        } 
    </div>
  )
}

export default Memoir