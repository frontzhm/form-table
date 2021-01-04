import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import * as api from "@/api";
// 让全局方便访问api
Vue.prototype.$api = api;

Vue.use(ElementUI);

new Vue({
  el: "#app",
  render: h => h(App)
});
