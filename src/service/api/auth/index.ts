import BaseApi from "../shared";
import { 
  SendCodeReq, 
  RegisterReq, 
  LoginReq, 
  ChangePasswordReq, 
  DeleteAccountReq, 
  LoginResData,
  SendCodeResData,
  RegisterResData,
  ChangePasswordResData,
  DeleteAccountResData,
} from "./types";

class Auth extends BaseApi {
  urls = {
    login: "/user/login",
    register: "/user/register",
    sendCode: "/user/send-code",
    changePassword: "/user/change-password",
    deleteAccount: "/user",
    getUserInfo: "/user/info"
  };

  tag = "Auth";

  async sendCode(data: SendCodeReq) {
    return this.http.post<SendCodeResData>(this.urls.sendCode, data);
  }

  async register(data: RegisterReq) {
    return this.http.post<RegisterResData>(this.urls.register, data);
  }

  async login(data: LoginReq) {
    return this.http.post<LoginResData>(this.urls.login, data);
  }

  async changePassword(data: ChangePasswordReq) {
    return this.http.put<ChangePasswordResData>(this.urls.changePassword, data);
  }

  async deleteAccount(data: DeleteAccountReq) {
    return this.http.delete<DeleteAccountResData>(this.urls.deleteAccount, { data });
  }
}

export const authApi = new Auth();
