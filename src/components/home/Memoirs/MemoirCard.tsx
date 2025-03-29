import { FC } from "react";
import { dateCalc } from "@/utils/dateCalc";
import { Button } from "antd";
import { MemoirData } from "@/service/api/home/types";
import { strLimit } from "@/utils/strLimit";

const MemoirCard:FC<MemoirData> = (props) => {
  return (
    <div className="col-center grow p-4 shadow rounded-2xl gap-2 min-w-[200px]"> 
      <div className="w-full flex flex-row justify-between">
        <p className="text-sm text-gray-300">{dateCalc(props.createdAt)}</p>
        {/**TODO Icon 预留 */}
      </div>
      <div className="w-full flex flex-row justify-start text-xl font-black">{strLimit(props.title)}</div>
      <div className="w-full text-wrap line-clamp-2 text-base text-gray-400">{props.content}</div>
      {/**功能区 */}
      <div className="w-full flex flex-row justify-between">
        <Button type="primary" className="shrink-1">查看全文</Button>
        <div className="flex flex-row gap-2">
          {/**TODO 功能按钮 */}
        </div>
      </div>
    </div>
  )
}
export default MemoirCard