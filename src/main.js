import Vue from 'vue'
import App from './App.vue'
import translation from "../public/assets/languages/en.json"
import trace from "@/utilities/debug.js"
import store from './store'

Vue.config.productionTip = false
window.$translation = translation;
window.trace = trace;

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
