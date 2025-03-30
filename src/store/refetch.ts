import { ActivityResData, MemoirData, MemoirResListData } from "@/service/api/home/types";
import { InfiniteData, QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { createImmerStore } from "./factory";


interface RefetchState {
  refetchMemoirList: (() => void)| null 
  refetchActionList: (() => void) | null
  refetchAll: (() => void) | null
  refetchStatus: (() => void) | null
}

interface RefetchActions {
  setRefetchMemoirList:( refetchState: RefetchState["refetchMemoirList"] ) => void
  setRefetchActionList: (refetchState: RefetchState["refetchActionList"]  ) => void
  setRefetchStatus: (refetchState: RefetchState["refetchStatus"] ) => void
}

export const useRefetchStore = createImmerStore<RefetchState, RefetchActions>(
  {
    refetchMemoirList: null,
    refetchActionList: null,
    refetchStatus: null,
    refetchAll() {
      if (this.refetchMemoirList) this.refetchMemoirList()
      if (this.refetchActionList) this.refetchActionList()
      if (this.refetchStatus) this.refetchStatus()
    },
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
    },
    setRefetchStatus: (refetchState) => {
      set((state) => {
        state.refetchStatus = refetchState
      })
    }
  })
)