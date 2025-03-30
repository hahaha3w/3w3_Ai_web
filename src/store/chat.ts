import { Conversation, Message } from "@/service/api/chat/types";
import { create } from "zustand";

// 定义组件所需的消息格式
interface ChatMessage {
  key: number;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
  loding: boolean;
}

// 将后端消息格式转换为组件所需格式
const convertMessageToChatMessage = (message: Message): ChatMessage => {
  return {
    key: message.messageId,
    role: message.senderType === "ai" ? "ai" : "user",
    content: message.content,
    timestamp: new Date(message.sendTime),
    loding: true
  };
};

// 定义 Zustand store 的状态和操作
interface ChatStore {
  messages: ChatMessage[]; // 组件使用的转换后消息
  rawMessages: Message[]; // 原始消息格式
  chatList: Conversation[];
  currentChatId: number | null;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  deleteMessage: (messageId: number) => void;
  setMessages: (newMessages: Message[]) => void;
  setMessage: (messageId: number, content: string) => void;
  setCurrentChat: (conversationId: number) => void;
  setChatList: (newChatList: Conversation[]) => void;
}

// 创建 Zustand store
const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  rawMessages: [],
  chatList: [], // 初始化为空数组，通过API获取真实数据
  currentChatId: null,
  addMessage: (message) =>
    set((state) => {
      const newRawMessage = { ...message, sendTime: new Date().toISOString() };
      const newRawMessages = [...state.rawMessages, newRawMessage];
      return {
        rawMessages: newRawMessages,
        messages: newRawMessages.map(convertMessageToChatMessage),
      };
    }),
  clearMessages: () => set({ rawMessages: [], messages: [] }),
  deleteMessage: (messageId) =>
    set((state) => {
      const newRawMessages = state.rawMessages.filter((msg) => msg.messageId !== messageId);
      return {
        rawMessages: newRawMessages,
        messages: newRawMessages.map(convertMessageToChatMessage),
      };
    }),
  setMessages: (newRawMessages) => set({
    rawMessages: newRawMessages,
    messages: newRawMessages.map(convertMessageToChatMessage),
  }),
  setMessage: (messageId, content) =>
    set((state) => {
      // 检查是否真的需要更新
      const targetMessage = state.rawMessages.find(msg => msg.messageId === messageId);
      if (targetMessage && targetMessage.content === content) {
        return state; // 内容没变，不触发更新
      }
      
      const newRawMessages = state.rawMessages.map((msg) =>
        msg.messageId === messageId ? { ...msg, content } : msg
      );
      return {
        rawMessages: newRawMessages,
        messages: newRawMessages.map(convertMessageToChatMessage),
      };
    }),
  setCurrentChat: (conversationId) => set({ currentChatId: conversationId }),
  setChatList: (newChatList) => set({ chatList: newChatList }),
}));

export default useChatStore;
export type { ChatMessage };
