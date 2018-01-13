<template>
    <v-container>
        <v-layout row wrap v-if="loading">
            <v-flex xs12 sm6 class="text-xs-center">
                <v-progress-circular
                indeterminate color="purple"
                :width="7"
                :size="70"
                v-if="loading">
                </v-progress-circular>
            </v-flex>
        </v-layout>
        <v-layout row wrap v-else>
            <v-flex xs12 sm6 class="pr-3">
                <v-card>
                    <v-card-title class="primary--text">
                        <h2>{{ boulder.name }}</h2>
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
                    <div>Grade by author: {{ boulder.grade }} </div>
                    <div>Avg grade: {{ boulder.grade }} </div>
                    <strong>Description:</strong> {{ boulder.description }} 
                </v-card-text>
                <v-card-actions v-if="userIsAuthenticated">
                    <v-spacer></v-spacer>
                    <v-btn class="primary" @click="addRemoveBoulderToClimbed">
                        {{ userClimbed ? 'Remove from climbed boulders' : 'Add to climbed boulders' }}
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-flex>
              <v-flex xs12 sm6 class="pr-3">
                <v-card>
                    <v-card-title class="primary--text">
                        <h2>Comments</h2>
                    </v-card-title>
                <v-card-text>
                  <div v-for="(comment, index) in boulder.comments" class="pt-3"> 
                    <strong>{{ comment.author.name }}: </strong>
                    {{ comment.text }} 
                  </div>  
                   <v-flex xs12>
                    <v-text-field
                      name="newComment"
                      label="Comment"
                      id="newComment"
                      v-model="description"
                      multi-line>
                    </v-text-field>
                  </v-flex>
                </v-card-text>
                <v-card-actions v-if="userIsAuthenticated">
                    <v-spacer></v-spacer>
                    <v-btn class="primary" @click="addRemoveBoulderToClimbed">
                       Leave Comment
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-flex>
           
        </v-layout>
    </v-container>
</template>

<script>
export default {
  data () {
    return {
      description: ''
    }
  },
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
    },
    userClimbed () {
      // check if boulderId is in the arrray (value is -1 if not)
      if (!this.userIsAuthenticated) {
        return false
      }
      return this.$store.getters.user.climbedBoulders.findIndex(boulderId => {
        return boulderId === this.boulder._id
      }) >= 0
    }
  },
  methods: {
    addRemoveBoulderToClimbed () {
      this.$store.dispatch('addRemoveBoulderToClimbed', this.boulder._id)
    }
  }
}
</script>

<style>

</style>
