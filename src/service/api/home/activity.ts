import BaseApi from "../shared";
import { ActivityResData, PostActivityData } from "./types";


 class ActivityApi extends BaseApi {
  urls = {
    activitys: "/activities",
  }
  tag = "Activity"

  async postActivity(data: PostActivityData) {
    return this.http.post(this.urls.activitys, data)
  }

  async getActivities(page: number = 1, page_size = 5) {
    const response = await this.http.get<ActivityResData>(this.urls.activitys + `?page=${page}&page_size=${page_size}`)
    console.log(response)
    //TODO @Yemomo511 临时兜底，保证主流程
    response.data.activities = response.data?.activities ?? []
    response.data.chatCount = 0
    response.data.memoirCount = 0
    response.data.useDay = 0
    return response.data
  }
}

export const activityApi = new ActivityApi()