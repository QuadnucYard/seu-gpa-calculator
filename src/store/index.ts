import { createStore } from "vuex";

type UserState = { token: string | undefined; data: { [k: string]: any } } | null;

export default createStore({
  state: {
    user: <UserState>{},
  },
  mutations: {
    login(state, data: UserState) {
      state.user = data;
    },
    logout(state) {
      // 注意不能用 null 清除，否则将无法判断 user 里具体的内容
      state.user = null;
    },
  },
  actions: {},
});
