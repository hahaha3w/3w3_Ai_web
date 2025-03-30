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
  chatList: [
    {
      conversationId: 1,
      createTime: new Date().toISOString(),
      mode: "chat",
      sessionTitle: "与AI的对话",
      userId: 123,
      lastMessage: "你好！有什么可以帮您的吗？",
    },
    {
      conversationId: 2,
      createTime: new Date().toISOString(),
      mode: "chat",
      sessionTitle: "天气查询",
      userId: 123,
      lastMessage: "今天是晴天，温度在25℃左右。",
    },
    {
      conversationId: 3,
      createTime: new Date().toISOString(),
      mode: "chat",
      sessionTitle: "代码助手",
      userId: 123,
      lastMessage: "好的，请告诉我具体需求。",
    },
  ],
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
  setCurrentChat: (conversationId) =>
    set(() => {
      let mockRawMessages: Message[] = [];
      if (conversationId === 1) {
        mockRawMessages = [
          {
            messageId: 1,
            conversationId: 1,
            content: "你好，AI！",
            sendTime: new Date().toISOString(),
            senderType: "user",
            userId: 123,
          },
          {
            messageId: 2,
            conversationId: 1,
            content: "你好！有什么可以帮您的吗？",
            sendTime: new Date().toISOString(),
            senderType: "ai",
            userId: 0,
          },
        ];
      } else if (conversationId === 2) {
        mockRawMessages = [
          {
            messageId: 3,
            conversationId: 2,
            content: "今天的天气怎么样？",
            sendTime: new Date().toISOString(),
            senderType: "user",
            userId: 123,
          },
          {
            messageId: 4,
            conversationId: 2,
            content: "今天是晴天，温度在25℃左右。",
            sendTime: new Date().toISOString(),
            senderType: "ai",
            userId: 0,
          },
        ];
      } else if (conversationId === 3) {
        mockRawMessages = [
          {
            messageId: 5,
            conversationId: 3,
            content: "帮我写一段代码。",
            sendTime: new Date().toISOString(),
            senderType: "user",
            userId: 123,
          },
          {
            messageId: 6,
            conversationId: 3,
            content: "好的，请告诉我具体需求。",
            sendTime: new Date().toISOString(),
            senderType: "ai",
            userId: 0,
          },
        ];
      }
      return {
        currentChatId: conversationId,
        rawMessages: mockRawMessages,
        messages: mockRawMessages.map(convertMessageToChatMessage),
      };
    }),
  setChatList: (newChatList) => set({ chatList: newChatList }),
}));

export default useChatStore;
export type { ChatMessage };
