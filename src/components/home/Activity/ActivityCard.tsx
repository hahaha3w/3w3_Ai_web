import { FC, useMemo } from "react";

import chat from "@/assets/activity/Aichat.svg"
import CreateFile from "@/assets/activity/file.svg"
import { dateCalc } from "@/utils/dateCalc";
import { ActivityData } from "@/service/api/home/types";

const ActivityCard: FC<ActivityData> = (props) => {
  const {type, description, createdAt} = useMemo(() => props,[props])
  const title = useMemo(()=> {
    return type == "chat" ? "新对话": "新回忆"
  }, [type])
  return (
    <div className="w-full p-4 flex flex-row justify-center items-start gap-4 bg-gray-100 rounded-2xl">
      <img src={type == "chat" ? chat: CreateFile} className="w-[20px]"></img>
      <div className="flex flex-col gap-2 justify-between items-start grow">
        <div className="text-xl font-bold">{title}</div>
        <div className="text-base">{description}</div>
        <div className="text-sm text-gray-400">{dateCalc(createdAt)}</div>
      </div>
    </div>
  )
}

export default ActivityCard