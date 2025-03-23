import { http } from "../utils/axios";

class User {
  private static urls = {
    getUserInfo: "/user/user-info",
    updateUserInfo: "/user/update-user",
  };

  static getUserInfo() {
    return http.get(this.urls.getUserInfo);
  }

  static updateUserInfo(data: {
    username: string;
    bio: string;
    avatar: string;
  }) {
    return http.put(this.urls.updateUserInfo, data);
  }
}

export default User;
