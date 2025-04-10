import { Conversation, Message } from "@/service/api/chat/types";
import { create } from "zustand";

// 定义组件所需的消息格式
interface ChatMessage {
  typing: boolean; // 是否正在输入
  key: number;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
  loading: boolean;
}

// 处理 senderType，将特殊字符映射为正确的角色
const getSenderRole = (senderType: string): "ai" | "user" => {
  // \u0001 表示用户，\u0002 表示 AI
  if (senderType === "\u0001") return "user";
  if (senderType === "\u0002") return "ai";

  // 兼容之前的字符串类型
  if (senderType === "user") return "user";
  if (senderType === "ai") return "ai";

  // 默认情况, 根据用户ID判断: 0为AI，其他为用户
  return senderType === "0" || String(senderType) === "0" ? "ai" : "user";
};

// 将后端消息格式转换为组件所需格式，默认启用typing
const convertMessageToChatMessage = (message: Message, keepTyping: boolean = true): ChatMessage => {
  const role = getSenderRole(message.senderType);
  return {
    typing: role === "ai" && keepTyping, // 只有AI消息才有typing效果，且根据参数决定是否开启
    key: message.messageId,
    role: role,
    content: message.content,
    timestamp: new Date(message.sendTime),
    loading: false
  };
};

// 定义 Zustand store 的状态和操作
interface ChatStore {
  messages: ChatMessage[]; // 组件使用的转换后消息
  rawMessages: Message[]; // 原始消息格式
  chatList: Conversation[];
  currentChatId: number | null;
  loadingHistory: boolean;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  deleteMessage: (messageId: number) => void;
  setMessages: (newMessages: Message[]) => void;
  setMessage: (messageId: number, content: string) => void;
  setMessageLoading: (messageId: number, loading: boolean) => void; // 新增方法
  setCurrentChat: (conversationId: number) => void;
  setChatList: (newChatList: Conversation[]) => void;
  setLoadingHistory: (loading: boolean) => void;
}

// 创建 Zustand store
const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  rawMessages: [],
  chatList: [],
  currentChatId: null,
  loadingHistory: false,
  addMessage: (message) =>
    set((state) => {
      const newRawMessage = { ...message, sendTime: new Date().toISOString() };
      const newRawMessages = [...state.rawMessages, newRawMessage];
      return {
        rawMessages: newRawMessages,
        messages: newRawMessages.map(msg => convertMessageToChatMessage(msg, true)), // 启用typing
      };
    }),
  clearMessages: () => set({ rawMessages: [], messages: [] }),
  deleteMessage: (messageId) =>
    set((state) => {
      const newRawMessages = state.rawMessages.filter((msg) => msg.messageId !== messageId);
      return {
        rawMessages: newRawMessages,
        messages: newRawMessages.map(msg => convertMessageToChatMessage(msg)),
      };
    }),
  setMessages: (newRawMessages) => set({
    rawMessages: newRawMessages,
    messages: newRawMessages.map(msg => convertMessageToChatMessage(msg, false)), // 禁用typing
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
      
      // 保持之前的typing状态
      const updatedMessages = newRawMessages.map((rawMsg) => {
        const existingMsg = state.messages.find(m => m.key === rawMsg.messageId);
        const isAi = getSenderRole(rawMsg.senderType) === "ai";
        return {
          ...convertMessageToChatMessage(rawMsg, true),
          typing: isAi && (existingMsg ? existingMsg.typing : true)
        };
      });
      
      return {
        rawMessages: newRawMessages,
        messages: updatedMessages,
      };
    }),
  setMessageLoading: (messageId, loading) =>
    set((state) => {
      const newMessages = state.messages.map((msg) =>
        msg.key === messageId ? { ...msg, loading } : msg
      );
      return { messages: newMessages };
    }),
  setCurrentChat: (conversationId) => set({ currentChatId: conversationId }),
  setChatList: (newChatList) => set({ chatList: newChatList }),
  setLoadingHistory: (loading) => set({ loadingHistory: loading }),
}));

export default useChatStore;
export type { ChatMessage };
