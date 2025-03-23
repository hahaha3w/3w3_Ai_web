import { http } from "../utils/axios";

class Chat {
  private static urls = {
    sendMessage: "/chat/send",
    getHistory: "/chat/history",
    clearHistory: "/chat/clear",
    setMood: "/user/mood",
  };

  static sendMessage(data: {
    message: string;
    mood?: string;
    containerID: string;
  }) {
    return http.post(this.urls.sendMessage, data);
  }

  static getHistory(
    params: { page?: number; size?: number } = { page: 1, size: 20 }
  ) {
    return http.get(this.urls.getHistory, { params });
  }

  static clearHistory() {
    return http.delete(this.urls.clearHistory);
  }

  static setMood(data: {
    mood: "happy" | "sad" | "angry" | "neutral" | "excited";
  }) {
    return http.post(this.urls.setMood, data);
  }
}

export default Chat;
