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

  async getActivities() {
    const response = await this.http.get<ActivityResData>(this.urls.activitys)
    return response.data
  }
}

export const activityApi = new ActivityApi()