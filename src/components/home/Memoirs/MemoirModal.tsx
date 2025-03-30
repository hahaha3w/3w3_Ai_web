import { ApiKeys } from "@/constants/apiKeys";
import Api from "@/service/api";
import { useModalBoxStore } from "@/store/modal";
import { useQuery } from "@tanstack/react-query";
import { Button, Empty, message, Modal } from "antd";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { mockText } from "./MemoirType";
import { dateCalc } from "@/utils/dateCalc";
import { useRefetchStore } from "@/store/refetch";
import { emptyOrItem } from "@/utils/strLimit";


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
    if (!axiosRes.data.success) {
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

  const formatContent = useCallback((content: string) => {
    return content
      .split("\n")
      .map((line) => `    ${line}`) // 在每一行前添加两个空格
      .join("\n");
  }, []);
  

  const modalCompo = useCallback(() => {
    if (!data) return <div>空</div>
    return (
      <div className="col-center gap-4 w-full h-full  ">
        {
          emptyOrItem(data.content)
           ? <div className="text-xl text-wrap whitespace-pre-wrap">{emptyOrItem(formatContent(data?.content))}</div>
           : <Empty description="回忆录呢? AI脑袋空空的~"></Empty>
        }
        <div className="text-sm self-start text-gray-400">{dateCalc(data.createdAt)}</div>
      </div>
    )
  }, [data])

  return (
  <Modal 
    className="min-w-[500px] absolute"
    open={props.isOpen}
    loading={isLoading}
    title={emptyOrItem(data?.title) ?? "默认标题"}
    onClose={() => hiddenBox()}
    onCancel={() => {
      hiddenBox()
      
      if (refetchMemoirList) {
        console.log("refetchData")
        refetchMemoirList()
      }
    }}
    width={'50%'}
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