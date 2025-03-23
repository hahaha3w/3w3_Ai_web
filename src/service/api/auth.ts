import { http } from "../utils/axios";

class Auth {
  private static urls = {
    login: "/auth/login",
    register: "/auth/register",
    sendCode: "/auth/send-code",
    changePassword: "/auth/change-password",
    deleteAccount: "/auth/delete",
  };

  static sendCode(email: string) {
    return http.post(this.urls.sendCode, { email });
  }

  static register(data: {
    email: string;
    code: string;
    password: string;
    confirm_password: string;
  }) {
    return http.post(this.urls.register, data);
  }

  static login(data: { email: string; password: string }) {
    return http.post(this.urls.login, data);
  }

  static changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    return http.put(this.urls.changePassword, data);
  }

  static deleteAccount(data: { password: string; confirmText: string }) {
    return http.delete(this.urls.deleteAccount, { data });
  }
}

export default Auth;
