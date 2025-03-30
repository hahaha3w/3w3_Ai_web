import { ModelBoxType, useModalBoxStore } from "@/store/modal"
import { Modal } from "antd"
import { useMemo } from "react"
import { MemoirModal } from "../home/Memoirs/MemoirModal"


export const ModalBox = () => {
  const {currentId, type} = useModalBoxStore()
  const isShow = useMemo(() => {
    return type != ModelBoxType.NONE && currentId != null
  }, [type, currentId])
  if (!isShow) return <></>
  return (
  <div>
    {
      type == ModelBoxType.MEMOIR_BOX && <MemoirModal isOpen={isShow} id={currentId ?? 0}></MemoirModal>
    }
  </div>
  )
}