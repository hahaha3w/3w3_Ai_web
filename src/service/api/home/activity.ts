import BaseApi from "../shared";
import { ActivityResData, PostActivityData } from "./data";


export class ActivityApi extends BaseApi {
  urls = {
    activitys: "/api/activities",
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

const activityApi = new ActivityApi()
export default activityApi