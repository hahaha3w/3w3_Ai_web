import Auth from "./auth";
import Chat from "./chat";
import User from "./user";

const Api = {
  Auth: new Auth(),
  User: new User(),
  Chat: new Chat(),
};

export default Api;
