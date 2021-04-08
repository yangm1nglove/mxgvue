import Vue from "vue";
//注意引入在vue下面
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";

Vue.use(ElementUI);

//权限拦截
import './permission'
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
