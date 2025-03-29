import { FC } from "react"
import MemoirCard from "./MemoirCard"
import { memoirsMockData } from "./MemoirType"
import { useQuery } from "@tanstack/react-query"
import Api from "@/service/api"

const Memoir: FC = () => {
  const {data, status} = useQuery({
    queryKey: ["activitys"], 
    queryFn: () => Api.memoirApi.getMemoirList(),
  })
  return (
    <div className="w-full h-[600px] p-4 flex flex-col items-start gap-4 ">
      <p className="text-xl font-bold">回忆录(展示最近15条)</p>
      <div className="w-full p-4 grid grid-flow-row grid-cols-3 gap-2">
      
        {
        data && data.memoirs ? 
          data.memoirs.map(item => {
            return <MemoirCard {...item} id={item.id}></MemoirCard>
          })
          : 
          <div>空</div>
        } 
      </div>
    </div>
  )
}

export default Memoir