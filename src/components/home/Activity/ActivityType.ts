export interface ActivityData {
  id: number,
  type: "chat" | "create", //TODO: @Yemomo511 进一步扩展活动信息
  content: string,
  time: string //后端商量 YYYY-MM-DD HH-MM 格式把
}

export const mockData: ActivityData[] = [
  {
    id: 1,
    type: "chat",
    content: "你与AI进行了一次对话",
    time: "2024-03-21 12:30"
  },
  {
    id: 2,
    type: "create",
    content: "你创造了一个回忆录",
    time: "2024-03-21 12:30"
  },
  {
    id:3,
    type: "chat",
    content: "你与AI进行了一次对话",
    time: "2024-03-21 12:30"
  },
  {
    id: 4,
    type: "create",
    content: "你创造了一个回忆录",
    time: "2024-03-21 12:30"
  },
  {
    id: 5,
    type: "chat",
    content: "你与AI进行了一次对话",
    time: "2024-03-21 12:30"
  },
  {
    id: 6,
    type: "create",
    content: "你创造了一个回忆录",
    time: "2024-03-21 12:30"
  }
]