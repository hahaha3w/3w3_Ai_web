
import { FC, useMemo } from "react";

import { dateCalc } from "@/utils/dateCalc";
import { ActivityData } from "@/service/api/home/types";

const MessageCard: FC<ActivityData> = ({type, description, createdAt}) => {
   const title = useMemo(()=> {
      return type == "chat" ? "新对话": "新回忆"
    }, [type])
  return (
    <div className="w-full p-4 flex flex-row justify-center items-start gap-1 bg-gray-100 rounded-2xl">
      <div className="flex flex-col gap-1 justify-around items-start grow">
        <div className="text-xl font-bold">{title}</div>
        <div className="text-sm line-clamp-1">{description}</div>
        <div className="text-xs text-gray-400">{dateCalc(createdAt)}</div>
      </div>
    </div>
  )
}

export default MessageCard