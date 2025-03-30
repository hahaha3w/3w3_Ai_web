import { ModelBoxType, useModalBoxStore } from "@/store/modal"
import { Modal } from "antd"
import { createContext, useMemo } from "react"
import { MemoirModal } from "../home/Memoirs/MemoirModal"

export const ModalBox = () => {
  const {currentId, type} = useModalBoxStore()
  const isShow = useMemo(() => {
    return type != ModelBoxType.NONE && currentId != null
  }, [type, currentId])
  if (!isShow) return <></>
  return (
    <div className="w-[50%] min-w-[300px] max-w-[800px]:">
        {
          type == ModelBoxType.MEMOIR_BOX && <MemoirModal isOpen={isShow} id={currentId ?? 0}></MemoirModal>
        }
   </div>
  )
}