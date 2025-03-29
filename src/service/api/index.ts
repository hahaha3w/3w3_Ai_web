import Auth from "./auth";
import Chat from "./chat";
import User from "./user";
import Test from "./test";
import { MemoirApi } from "./home/memoir";
import {ActivityApi} from "./home/activity"
const Api = {
  Auth,
  Chat,
  User,
  Test,
  memoirApi: new MemoirApi(),
  activityApi: new ActivityApi(),
};

export default Api;
