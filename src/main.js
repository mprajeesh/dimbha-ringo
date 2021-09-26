import Vue from 'vue'
import App from './App.vue'
import translation from "../public/assets/languages/en.json"
import trace from "@/utilities/debug.js"

Vue.config.productionTip = false
window.$translation = translation;
window.trace = trace;

new Vue({
  render: h => h(App),
}).$mount('#app')
