import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import App from './App'
import router from './router'
import { store } from './store/index'
import AlertCmp from './components/Shared/Alert.vue'
import EditBoulderDialog from './components/boulders/edit/EditBoulderDialog.vue'

Vue.use(Vuetify, {
  theme: {
    primary: '#FF5733',
    secondary: '#6C1717',
    accent: '#6C176B',
    error: '#b71c1c'
  }
})

Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-boulder-dialog', EditBoulderDialog)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    if (this.$store.getters.isLoggedIn) {
      this.$store.dispatch('autoSignIn')
    }
    this.$store.dispatch('loadBoulders')
  }
})
