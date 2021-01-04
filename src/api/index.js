import axios from "axios";

// 所有请求统一配置
const instance = axios.create({ timeout: 5000 });

// 请求拦截器，统一加些appid、sign之类的
instance.interceptors.request.use(
  config => {
    config.method === "get" && (config.params.appid = "颜酱");
    return config;
  },
  error => Promise.error(error)
);

// 响应拦截器，错误的统一处理
instance.interceptors.response.use(
  // 请求成功
  res => {
    //   200的状态就是请求成功了
    const isSuccess = res.status === 200;
    if (!isSuccess) {
      Promise.reject(res);
      return;
    }
    return Promise.resolve(res.data);
  },
  // 请求失败
  error => {
    console.log(error);
    if (!window.navigator.onLine) {
      this.$message.error("网不好");
      return;
    }
    const { response } = error;
    if (response) {
      this.$message.error(response.message);
    }
  }
);

export const ApiGetList = ({
  pageIndex,
  pageSize,
  sortBy,
  isAsc,
  year,
  quarter,
  name
}) =>
  instance.get("/api/list", {
    params: { pageIndex, pageSize, sortBy, isAsc, year, quarter, name }
  });
