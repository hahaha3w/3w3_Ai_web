import BaseApi from "../shared";
import { CreatecConversationReq, CreatecConversationResData, DeleteConversationResData, GetConversationListReq, GetConversationListResData, GetMsgHistoryReq, GetMsgHistoryResData, SendMsgReq } from "./types";


class Chat extends BaseApi {
  urls = {
    sendMsg: "/chat/message",
    msgHistory: "/chat/message/list",
    conversation: "/chat/conversation",
  };

  tag = "Chat";

  async sendMsg(data: SendMsgReq, onMsg: (data: any) => void, onError?: (error: unknown) => void) {
    let isCompleted = false;
    let controller: AbortController | null = new AbortController();
    
    try {
      let lastProcessedLength = 0;

      const response = this.http.get(this.urls.sendMsg, {
        params: data,
        responseType: 'text',
        signal: controller.signal,
        onDownloadProgress: (progressEvent) => {
          try {
            const responseText = progressEvent.event?.target?.response || '';
            if (responseText.length <= lastProcessedLength) return;

            // Only process the new part of the response
            const newContent = responseText.substring(lastProcessedLength);
            lastProcessedLength = responseText.length;

            const chunks = newContent.split('event:message\ndata:').filter(Boolean);

            // Process only new chunks
            for (let i = 0; i < chunks.length; i++) {
              const chunk = chunks[i].trim();
              try {
                const jsonData = JSON.parse(chunk);
                console.log("Received data:", jsonData);

                // Check if this is the end of the stream (empty message object)
                if (jsonData.message && Object.keys(jsonData.message).length === 0) {
                  console.log("Stream completed");
                  isCompleted = true;
                  onMsg({ end: true });
                  // You can add additional completion handling here if needed
                } else {
                  onMsg(jsonData);
                }
              } catch (error) {
                console.warn("Failed to parse chunk:", chunk, error);
              }
            }
          } catch (error) {
            if (onError && !isCompleted) {
              onError(error);
            }
          }
        }
      });
      
      // 返回一个清理函数，可用于取消请求
      return () => {
        if (controller) {
          controller.abort();
          controller = null;
          console.log("Request aborted by user");
        }
      };
    } catch (error) {
      console.error("Error in sendMsg:", error);
      // 确保在出错时也能清理资源
      return () => {
        if (controller) {
          controller.abort();
          controller = null;
        }
      };
    }
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
