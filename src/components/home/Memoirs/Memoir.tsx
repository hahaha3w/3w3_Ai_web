import { FC, useEffect } from "react"
import MemoirCard from "./MemoirCard"
import { memoirsMockData } from "./MemoirType"
import { useQuery } from "@tanstack/react-query"
import Api from "@/service/api"
import { Empty, Spin } from "antd"
import { LoadingOutlined } from '@ant-design/icons';
import { useRefetchStore } from "@/store/refetch"


const Memoir: FC = () => {
  const {setRefetchMemoirList} = useRefetchStore()
  const {data, status, refetch} = useQuery({
    queryKey: ["activitys"], 
    queryFn: () => Api.memoirApi.getMemoirList(),
  })

  useEffect(() => {
    setRefetchMemoirList(refetch)
  }, [refetch, setRefetchMemoirList])
  
  return (
    <div className="w-full h-[600px] p-4 flex flex-col items-start gap-4 ">
      <p className="text-xl font-bold">回忆录(展示最近15条)</p>
        { data && data.memoirs ? 
          <div className="w-full p-4 grid grid-flow-row grid-cols-3 gap-2">
            { data.memoirs.length != 0 
              ? data.memoirs.map(item => {
                return <MemoirCard {...item} id={item.id}></MemoirCard>
              })
              : <Empty />
           }
          </div>
          : 
          <Spin className=" self-center" indicator={<LoadingOutlined  style={{ fontSize: 60}} spin></LoadingOutlined>} size="large" />
        } 
    </div>
  )
}

export default Memoir