export interface SendMsgReq {
  content: string;
  conversationId: number;
  [property: string]: any;
}

export interface SendMsgResData {
  message: {
    content?: string
  };
  end?: boolean;
  [property: string]: any;
}

export interface Message {
  content: string;
  conversationId: number;
  messageId: number;
  sendTime: string;
  senderType: string;
  userId: number;
  [property: string]: any;
}

export interface GetMsgHistoryReq {
  conversationId?: number;
  pageNum?: number;
  pageSize?: number;
  [property: string]: any;
}

export interface GetMsgHistoryResData {
  messages: Message[];
  total: number;
  [property: string]: any;
}

export interface Conversation {
  conversationId: number;
  createTime: string;
  updatedAt: string;
  createdAt: string;
  mode: string;
  sessionTitle: string;
  userId: number;
  [property: string]: any;
}

export interface CreatecConversationReq {
  mode: string;
  sessionTitle: string;
  [property: string]: any;
}

export interface CreatecConversationResData {
  conversation: Conversation;
  [property: string]: any;
}

export interface GetConversationListReq {
  pageNumber?: number;
  pageSize?: number;
  [property: string]: any;
}

export interface GetConversationListResData {
  conversations: Conversation[];
  total: number;
  [property: string]: any;
}

export interface DeleteConversationReq {
  conversationId: number;
  [property: string]: any;
}

export interface DeleteConversationResData {
  success: boolean;
  [property: string]: any;
}