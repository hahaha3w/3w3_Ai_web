export interface PostActivityData {
  userId: number,
  relationId: number,
  type: "chat" | "memoir",
  description: string
}

export interface PostActivityDataSuccess {
  success: boolean,
  message: string,
  activity: ActivityData
}

export interface ActivityData {
  activityId: number
  userId: number
  relationId: number
  type: "chat" | "memoir",
  description: string,
  createdAt: string 
}

export interface ActivityResData {
  activities: ActivityData[],
  chatCount: number,
  memoirCount: number,
  useDay: number,
  hasMore: boolean,
}

export interface MemoirData {
  id: number,
  userId: number,
  title: string,
  content: string,
  type: string,
  style: string,
  startDate: string,
  endDate: string,
  createdAt: string,
}

export interface GenerateMemoryReq {
  type: "Memoir",
  style: string,
  startDate: string,
  endDate: string,
}

export interface MemoirResListData {
  memoirs: MemoirData[],
  total: number,
  hasMore: boolean,
}

export interface MemoirResData {
  memoir: MemoirData,
}

export interface MemoirDeleteRes {
  success?: boolean,
  errorMsg?: string
}