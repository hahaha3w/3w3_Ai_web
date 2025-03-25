import { create } from "zustand";

// 定义聊天消息的类型
interface ChatMessage {
  key: number;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
}

// 定义 Zustand store 的状态和操作
interface ChatStore {
  messages: ChatMessage[];
  chatList: { id: number; name: string }[]; // 新增 chatList
  currentChatId: number | null; // 当前对话 ID
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  deleteMessage: (key: number) => void;
  setMessages: (newMessages: ChatMessage[]) => void;
  setMessage: (key: number, content: string) => void;
  setCurrentChat: (id: number) => void; // 新增 setCurrentChat 方法
  setChatList: (newChatList: { id: number; name: string }[]) => void; // 新增 setChatList 方法
}

// 创建 Zustand store
const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  chatList: [
    { id: 1, name: "对话 1" },
    { id: 2, name: "对话 2" },
    { id: 3, name: "对话 3" },
  ],
  currentChatId: null,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, timestamp: new Date() }],
    })),
  clearMessages: () => set({ messages: [] }),
  deleteMessage: (key) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.key !== key),
    })),
  setMessages: (newMessages) => set({ messages: newMessages }),
  setMessage: (key, content) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.key === key ? { ...msg, content } : msg
      ),
    })),
  setCurrentChat: (id) =>
    set(() => {
      let mockMessages: ChatMessage[] = [];
      if (id === 1) {
        mockMessages = [
          { key: 1, role: "user", content: "你好，AI！", timestamp: new Date() },
          { key: 2, role: "ai", content: "你好！有什么可以帮您的吗？", timestamp: new Date() },
        ];
      } else if (id === 2) {
        mockMessages = [
          { key: 3, role: "user", content: "今天的天气怎么样？", timestamp: new Date() },
          { key: 4, role: "ai", content: "今天是晴天，温度在25℃左右。", timestamp: new Date() },
        ];
      } else if (id === 3) {
        mockMessages = [
          { key: 5, role: "user", content: "帮我写一段代码。", timestamp: new Date() },
          { key: 6, role: "ai", content: "好的，请告诉我具体需求。", timestamp: new Date() },
        ];
      }
      return { currentChatId: id, messages: mockMessages };
    }),
  setChatList: (newChatList) => set({ chatList: newChatList }), // 实现 setChatList 方法
}));

export default useChatStore;
