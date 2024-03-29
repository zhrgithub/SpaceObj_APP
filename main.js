import App from './App'
// import VueClipboard from "vue-clipboard2";
// Vue.use(VueClipboard);

import share from "./common/share.js"
//混入开发全局注册
Vue.mixin(share)

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif