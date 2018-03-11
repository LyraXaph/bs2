<template>
  <v-container>
    <v-layout row wrap  v-for="user in users" :key="user._id" class="mb-2">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card class="info">
          <v-container fluid>
            <v-layout row>
              <v-flex xs7 sm8 md9>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">{{ user.username }}</h3>
                  </div>
                </v-card-title>
                 <v-card-actions>
                  <v-btn flat @click="deleteUser(user)" >Delete</v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Api from '@/services/Api'

export default {
  data () {
    return {
      users: null
    }
  },
  methods: {
    async deleteUser (user) {
      try {
        await Api().delete(`users/${user._id}`)
      } catch (err) {
        console.log(err)
      }
      var index = this.users.indexOf(user)
      this.users.splice(index, 1)
    }
  },
  async mounted () {
    this.users = (await Api().get(`users/`)).data
  }
}
</script>

<style>

</style>
