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
  DeleteAccountResData
} from "./types";

class Auth extends BaseApi {
  urls = {
    login: "/auth/login",
    register: "/auth/register",
    sendCode: "/auth/send-code",
    changePassword: "/auth/change-password",
    deleteAccount: "/auth/delete",
  };

  tag = "Auth";

  sendCode(data: SendCodeReq) {
    return this.http.post<SendCodeResData>(this.urls.sendCode, data);
  }

  register(data: RegisterReq) {
    return this.http.post<RegisterResData>(this.urls.register, data);
  }

  login(data: LoginReq) {
    return this.http.post<LoginResData>(this.urls.login, data);
  }

  changePassword(data: ChangePasswordReq) {
    return this.http.put<ChangePasswordResData>(this.urls.changePassword, data);
  }

  deleteAccount(data: DeleteAccountReq) {
    return this.http.delete<DeleteAccountResData>(this.urls.deleteAccount, { data });
  }
}

export default new Auth();
