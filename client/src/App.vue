<template>
  <v-app dark>
    <v-toolbar app class="primary">
      <v-toolbar-side-icon @click="sideNav=!sideNav"
        class="hidden-sm-and-up"
      ></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor:pointer">
          Bouldershare
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only"  >
        <v-btn 
        flat
        v-for="item in menuItems"
        :key="item.title"
        router
        :to="item.link">        
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
          </v-btn>
          <v-btn 
          flat
          v-if="userIsAuthenticated"
          @click="onLogout">        
          <v-icon left>exit_to_app</v-icon>
          Logout
          </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
        <router-view></router-view>
    </main>
    <v-navigation-drawer app v-model="sideNav" temporary>
      <v-list>
        <v-list-tile 
          v-for="item in menuItems" 
          :key="item.title"
          router
          :to="item.link">
          <v-list-tile-action>
            <v-icon left>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile 
          v-if="userIsAuthenticated" 
          @click="onLogout"> 
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false
      }
    },
    computed: {
      menuItems () {
        let menuItems = [
          { icon: 'trending_up', title: 'View Boulders', link: '/boulders' },
          { icon: 'face', title: 'Register', link: '/register' },
          { icon: 'lock_open', title: 'Sign in', link: '/signin' }
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
            { icon: 'trending_up', title: 'View Boulders', link: '/boulders' },
            { icon: 'room', title: 'View Gyms', link: '/gyms' },
            { icon: 'person', title: 'Profile', link: '/profile' }
          ]
        }
        return menuItems
      },
      userIsAuthenticated () {
        // return this.$store.getters.user !== null && this.$store.getters.user !== undefined
        return this.$store.getters.isLoggedIn
      }
    },
    methods: {
      onLogout () {
        this.$store.dispatch('logout')
      }
    }
  }
</script>
