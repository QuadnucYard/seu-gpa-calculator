import { createStore } from "vuex";
import Cookies from "js-cookie";

type UserState = { token: string | undefined; data: { [k: string]: any } } | null;

export default createStore({
  state: {
    user: <UserState>{ token: Cookies.get("token") },
  },
  mutations: {
    login(state, data: UserState) {
      state.user = data;
      Cookies.set("token", data?.token ?? "", { expires: 1 });
    },
    logout(state) {
      // 注意不能用 null 清除，否则将无法判断 user 里具体的内容
      state.user = null;
      Cookies.remove("token");
    },
  },
  actions: {},
});
