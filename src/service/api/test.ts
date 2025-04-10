import { http } from "../utils/axios";

class TestApi {
  private static urls = {
    subscribe: "/sse",
  };

  static subscribeToUpdates<T>(
    onMessage: (data: T) => void,
    onError?: (error: unknown) => void
  ) {
    const eventSource = new EventSource(
      http.defaults.baseURL + this.urls.subscribe
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
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
      eventSource.close(); // Return a function to allow unsubscribing
    };
  }
}

export const testApi = new TestApi();
