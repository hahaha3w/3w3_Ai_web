import { FC } from "react"
import { MemoirData, memoirsMockData } from "./MemoirType"
import MemoirCard from "./MemoirCard"

const Memoir: FC = () => {
  return (
    <div className="w-full p-4 grid grid-flow-row grid-cols-3 gap-2">
      {memoirsMockData.map(item => {
        return <MemoirCard {...item} id={item.id}></MemoirCard>
      })}
    </div>
  )
}

export default Memoir