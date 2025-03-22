import { FC, useMemo } from "react";
import { ActivityData } from "./ActivityType";
import chat from "@/assets/activity/Aichat.svg"
import CreateFile from "@/assets/activity/file.svg"
import { dateCalc } from "@/utils/dateCalc";

const ActivityCard: FC<ActivityData> = ({type, content, time}) => {
  
  const title = useMemo(()=> {
    return type == "chat" ? "新对话": "新回忆"
  }, [type])
  return (
    <div className="w-full p-4 flex flex-row justify-center items-start gap-4 bg-gray-100 rounded-2xl">
      <img src={type == "chat" ? chat: CreateFile} className="w-[20px]"></img>
      <div className="flex flex-col gap-2 justify-between items-start grow">
        <div className="text-xl font-bold">{title}</div>
        <div className="text-base">{content}</div>
        <div className="text-sm text-gray-400">{dateCalc(time)}</div>
      </div>
    </div>
  )
}

export default ActivityCard