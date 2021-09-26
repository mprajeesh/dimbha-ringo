import Vue from "vue";
import Vuex from "vuex";
import caller from "@/store/modules/caller";

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  modules: {
    caller,
  },
});
