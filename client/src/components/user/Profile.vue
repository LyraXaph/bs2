<template>
    <v-container class="mt-4">
        <v-layout row wrap v-if="loading">
            <v-flex xs12 sm6 offset-sm3 class="text-xs-center">
                <v-progress-circular
                indeterminate color="purple"
                :width="7"
                :size="70"
                v-if="loading">
                </v-progress-circular>
            </v-flex>
        </v-layout>
        <v-layout row wrap v-else>
            <v-flex  xs12 sm6  offset-sm3>
                <v-card v-if="user !== null">
                    <v-card-title class="primary--text">
                      <h1> Profile details </h1>
                       <v-spacer></v-spacer>
                      <app-edit-user-dialog :user="user"></app-edit-user-dialog>
                    </v-card-title>
                <v-card-text>
                    <h3> Name: {{ user.name }} </h3>
                    <h3> Lastname: {{ user.lastname }} </h3>
                    <h3> Email: {{ user.email }} </h3>
                    <h3> Gym: {{ user.gym.name }} </h3>
                </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import AppEditUserDialog from './EditUserDialog.vue'
export default {
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    user () {
      return this.$store.getters.user
    }
  },
  components: {
    AppEditUserDialog
  }
}
</script>

<style>

</style>
