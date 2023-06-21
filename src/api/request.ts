import axios from "axios";
import { Notify } from "quasar";

import { getToken } from "@/utils/auth";
// import Config from '@/settings'
// import Cookies from "js-cookie";

// 创建axios实例
const service = axios.create({
  // baseURL: import.meta.env.VITE_APP_BASE_API + "/api",
  baseURL: "/api",
  timeout: 10000, // 请求超时时间
  withCredentials: true,
  // headers: { "Access-Control-Allow-Origin": "*" },
});

// request拦截器
service.interceptors.request.use(
  config => {
    console.log("gettoken", getToken());
    if (getToken()) {
      config.headers["Authorization"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // config.headers["Content-Type"] = "application/json";
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.status;
    if (code < 200 || code > 300) {
      return Promise.reject("error");
    } else {
      return response;
    }
  },
  error => {
    let code = 0;
    try {
      code = error.response.status;
    } catch (e) {
      if (error.toString().indexOf("Error: timeout") !== -1) {
        Notify.create({ type: "negative", message: "网络请求超时" });
        return Promise.reject(error);
      }
    }
    if (code) {
      if (code === 401) {
        const $store = useStore();
        /* $store.dispatch("logout").then(() => {
          // 用户登录界面提示
          // Cookies.set("point", 401);
          location.reload();
        }); */
        Notify.create({ type: "negative", message: error });
      } else if (code === 403) {
        /* const $router = useRouter();
        $router.push({ path: "/401" }); */
        Notify.create({ type: "negative", message: error });
      } else {
        const errorMsg = error.response.data.message;
        if (errorMsg !== undefined) {
          Notify.create({ type: "negative", message: errorMsg });
        } else {
          Notify.create({ type: "negative", message: "Unknown error" });
        }
      }
    } else {
      Notify.create({ type: "negative", message: "接口请求失败" });
    }
    return Promise.reject(error);
  }
);

export default service;
