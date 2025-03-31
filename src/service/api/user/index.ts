import { http } from "../../utils/axios";
import BaseApi from "../shared";
import { UserInfoData } from "./types";

class UserApi extends BaseApi {
  urls = {
    userInfo: "/user/info",
  };

  tag: string = "UserApi"

  async getUserInfo(): Promise<UserInfoData> {
    const response = await http.get<UserInfoData>(this.urls.userInfo);
    return response.data
  }

  async updateUserInfo(data: {
    username: string;
    bio: string;
    avatar: string;
  }) {
    return http.put(this.urls.userInfo, data);
  }
}

export const userApi = new UserApi();
