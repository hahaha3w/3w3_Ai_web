import { create } from 'zustand';

// 定义聊天消息的类型
interface ChatMessage {
  key: number;
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

// 定义 Zustand store 的状态和操作
interface ChatStore {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  deleteMessage: (key: number) => void;
  setMessages: (newMessages: ChatMessage[]) => void; // 新增 setMessages 方法
}

// 创建 Zustand store
const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, { ...message, timestamp: new Date() }] })),
  clearMessages: () => set({ messages: [] }),
  deleteMessage: (key) => set((state) => ({ messages: state.messages.filter((msg) => msg.key !== key) })),
  setMessages: (newMessages) => set({ messages: newMessages }), // 实现 setMessages 方法
}));

export default useChatStore;
