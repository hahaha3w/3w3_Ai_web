import { FC } from "react";
import { MemoirData } from "./MemoirType";
import { dateCalc } from "@/utils/dateCalc";
import { Button } from "antd";

const MemoirCard:FC<MemoirData> = (props) => {
  return (
    <div className="col-center grow p-4 shadow rounded-2xl gap-2"> 
      <div className="w-full flex flex-row justify-between">
        <p className="text-sm text-gray-300">{dateCalc(props.date)}</p>
        {/**TODO Icon 预留 */}
      </div>
      <div className="w-full flex flex-row justify-start text-xl font-black">{props.theme}</div>
      <div className="w-full text-wrap line-clamp-2 text-base text-gray-400">{props.des}</div>
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