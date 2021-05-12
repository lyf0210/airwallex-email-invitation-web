import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import i18n from "@/lang";
import "@/styles/element-variables.scss";
import "@/styles/index.scss";

Vue.config.productionTip = false;

Vue.use(ElementUI, {
  size: "medium", // Set element-ui default size
  i18n: (key: string, value: string) => i18n.t(key, value),
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
