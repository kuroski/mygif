import "./assets/main.css";
import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";
import { VLazyImagePlugin } from "v-lazy-image";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.use(VueCompositionAPI);
Vue.use(VLazyImagePlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
