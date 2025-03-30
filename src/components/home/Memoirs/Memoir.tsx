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
    <div className="w-full h-[600px] p-4 flex flex-col items-start gap-4 ">
      <p className="text-xl font-bold">回忆录(可往下滚动刷新)</p>
        {status === 'pending' && <Spin className=" self-center" indicator={<LoadingOutlined  style={{ fontSize: 60}} spin></LoadingOutlined>} size="large" /> }
        { data ? 
          <div className="h-[600px] overflow-auto w-full" id="scrollable_memoir_list">
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
              <div className="w-full flex flex-row justify-around gap-4">
                <Skeleton.Node style={{
                  width: window.innerWidth * 0.26,
                  height: 150,
                }} active>
                </Skeleton.Node>
                <Skeleton.Node  style={{
                  width: window.innerWidth * 0.26,
                  height: 150,
                }} active />
                <Skeleton.Node style={{
                  width: window.innerWidth * 0.26,
                  height: 150,
                }} active />
              </div>}
              endMessage = {
                <div className="w-full row-center text-sm text-gray-400">没有回忆录了，快去生成吧~</div>
              }
              scrollableTarget="scrollable_memoir_list"
            >
              
                { data.pages[0].memoirs.length != 0 
                  ? 
                  <div className="w-full p-4 grid grid-flow-row grid-cols-3 gap-2">
                    {
                    data.pages.map(memoirList => {
                      return memoirList.memoirs.map((item) => <MemoirCard {...item} id={item.id}></MemoirCard>)
                    })
                  }
                  </div>
                  : 
                  <div className="w-full col-center">
                    <Empty description={"暂无数据哦"}/>
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