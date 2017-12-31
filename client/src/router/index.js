import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Boulders from '@/components/boulders/Boulders'
import CreateBoulder from '@/components/boulders/CreateBoulder'
import Profile from '@/components/user/Profile'
import Register from '@/components/user/Register'
import Signin from '@/components/user/Signin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/boulders',
      name: 'Boulders',
      component: Boulders
    },
    {
      path: '/boulders/new',
      name: 'CreateBoulder',
      component: CreateBoulder
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }
  ],
  mode: 'history'
})
