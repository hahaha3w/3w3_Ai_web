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
  console.log(data, status)
  return (
    <div className="w-full p-4 grid grid-flow-row grid-cols-3 gap-2">
      {
      data? 
        data.memoirs.map(item => {
          return <MemoirCard {...item} id={item.id}></MemoirCard>
        })
        : 
        <div>空</div>
      } 
    </div>
  )
}

export default Memoir