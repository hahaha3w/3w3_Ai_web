import { ApiKeys } from "@/constants/apiKeys";
import Api from "@/service/api";
import { useModalBoxStore } from "@/store/modal";
import { useQuery } from "@tanstack/react-query";
import { Button, message, Modal } from "antd";
import { FC, useCallback, useMemo, useState } from "react";
import { mockText } from "./MemoirType";
import { dateCalc } from "@/utils/dateCalc";
import { useRefetchStore } from "@/store/refetch";


interface MemoirModalProps {
  isOpen: boolean;
  id: number;
}

export const MemoirModal: FC<MemoirModalProps> = (props) => {
  const {hiddenBox} = useModalBoxStore()
  const {refetchMemoirList} = useRefetchStore()
  const {data , isLoading} = useQuery({
    queryKey: [ApiKeys.memoir, props.id],
    queryFn: () => Api.memoirApi.getMemoirDetail(props.id)
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteData = useCallback(async () => {
    setIsDeleting(true)
    const axiosRes = await Api.memoirApi.deleteResponseData(props.id)
    if (axiosRes.status != 200) {
      setIsDeleting(false)
      message.error(`删除失败, error: ${axiosRes?.data?.errorMsg}`)
      hiddenBox()
    } else {
      setIsDeleting(false)
      message.success("删除成功")
      if (refetchMemoirList) refetchMemoirList()
      hiddenBox()
    }
  }, [hiddenBox, props.id,  refetchMemoirList])

  const modalCompo = useCallback(() => {
    if (!data) return <div>空</div>
    return (
      <div className="col-center gap-4 w-full ">
        {/* <div className="text-xl text-wrap">{data.memoir.content}</div> */}
        <div className="text-base text-wrap grow overflow-scroll">{mockText+"\n"+mockText+mockText}</div>
        <div className="text-sm self-start text-gray-400">{dateCalc(data.memoir.createdAt)}</div>
      </div>
    )
  }, [data])

  return (
  <Modal 
    className=" max-h-[80%] absolute"
    open={props.isOpen}
    loading={isLoading}
    title={data?.memoir.title ?? "开心的一天"}
    onClose={() => hiddenBox()}
    onCancel={() => hiddenBox()}
    width={'50%'}
    // height={'80%'}
    footer={[
      <Button danger loading={isDeleting} onClick={deleteData}>
        删除
      </Button>,
      <Button type="primary" onClick={hiddenBox}>
        知道了
      </Button>
    ]}
  >
    {modalCompo()}
  </Modal>
  )
}