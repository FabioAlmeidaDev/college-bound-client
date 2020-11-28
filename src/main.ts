// @ts-nocheck
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store/index";
import { VueMaskDirective } from 'v-mask'

Vue.config.productionTip = false;

Vue.directive('mask', VueMaskDirective);


new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
