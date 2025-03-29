import BaseApi from "../shared";
import { CreatecConversationReq, CreatecConversationResData, DeleteConversationResData, GetConversationListReq, GetConversationListResData, GetMsgHistoryReq, GetMsgHistoryResData, SendMsgReq } from "./types";


class Chat extends BaseApi {
  urls = {
    sendMsg: "/chat/message",
    msgHistory: "/chat/message/list",
    conversation: "/chat/conversation",
  };

  tag = "Chat";

  sendMsg(data: SendMsgReq, onMsg: (data: any) => void, onError?: (error: unknown) => void) {
    const queryParams = new URLSearchParams(data as Record<string, string>).toString();
    const eventSource = new EventSource(`${this.http.defaults.baseURL}${this.urls.sendMsg}?${queryParams}`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMsg(data);
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    };
    eventSource.onerror = (error) => {
      if (onError) {
        onError(error);
      }
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }

  getMsgHistory(data: GetMsgHistoryReq) {
    return this.http.get<GetMsgHistoryResData>(this.urls.msgHistory, { params: data });
  }

  createConversation(data: CreatecConversationReq) {
    return this.http.post<CreatecConversationResData>(this.urls.conversation, data);
  }

  getConversationList(data: GetConversationListReq) {
    return this.http.get<GetConversationListResData>(this.urls.conversation, { params: data });
  }

  deleteConversation(data: { conversationId: number }) {
    return this.http.delete<DeleteConversationResData>(this.urls.conversation, { data });
  }
}

export const chatApi = new Chat();
