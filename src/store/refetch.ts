import { ActivityResData, MemoirResListData } from "@/service/api/home/types";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { createImmerStore } from "./factory";


interface RefetchState {
  refetchMemoirList: ((options?: RefetchOptions) => Promise<QueryObserverResult<MemoirResListData, Error>>) | null 
  refetchActionList: ((options?: RefetchOptions) => Promise<QueryObserverResult<ActivityResData, Error>>) | null
}

interface RefetchActions {
  setRefetchMemoirList:( refetchState: RefetchState["refetchMemoirList"] ) => void
  setRefetchActionList: (refetchState: RefetchState["refetchActionList"]  ) => void
}

export const useRefetchStore = createImmerStore<RefetchState, RefetchActions>(
  {
    refetchMemoirList: null,
    refetchActionList: null
  },
  (set) => ({
    setRefetchMemoirList: (refetchState) => {
      set((state) => {
        state.refetchMemoirList = refetchState
      })
    },
    setRefetchActionList: (refetchState) => {
      set((state) => {
        state.refetchActionList = refetchState
      })
    }
  })
)