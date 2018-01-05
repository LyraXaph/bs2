import Vue from 'vue'
import Vuex from 'vuex'
import boulder from './boulder'
import user from './user'
import shared from './shared'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    boulder: boulder,
    user: user,
    shared: shared
  }
})
