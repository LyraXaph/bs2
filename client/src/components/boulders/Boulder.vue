<template>
    <v-container>
        <v-layout row wrap v-if="loading">
            <v-flex xs12 class="text-xs-center">
                <v-progress-circular
                indeterminate color="purple"
                :width="7"
                :size="70"
                v-if="loading">
                </v-progress-circular>
            </v-flex>
        </v-layout>
        <v-layout row wrap v-else>
            <v-flex xs12>
                <v-card>
                    <v-card-title class="primary--text">
                        {{ boulder.name }}
                        <template v-if="userIsCreateor">
                            <v-spacer></v-spacer>
                            <app-edit-boulder-dialog :boulder="boulder"></app-edit-boulder-dialog>
                        </template>
                    </v-card-title>
                     <v-card-media
                        :src="baseServerImageUrl + boulder.image"
                        height="600px">
                </v-card-media>
                <v-card-text>
                    <div> {{ boulder.grade }} </div>
                     {{ boulder.description }} 
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="primary">
                        Climbed it!
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  props: ['id'],
  computed: {
    boulder () {
      return this.$store.getters.loadedBoulder(this.id)
    },
    baseServerImageUrl () {
      return this.$store.getters.baseServerImageUrl
    },
    loading () {
      return this.$store.getters.loading
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
    userIsCreateor () {
      if (!this.userIsAuthenticated) {
        return false
      }
      return this.$store.getters.user.id === this.boulder.creatorId
    }
  }
}
</script>

<style>

</style>
