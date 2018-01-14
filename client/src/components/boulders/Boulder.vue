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
              <form  @submit.prevent="addComment">
                <v-card-text>
                  <v-list three-line>
                    <template v-for="(comment, index) in boulder.comments"> 
                      <v-list-tile-content>
                        <v-list-tile-title v-html="comment.author.name"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="comment.text"></v-list-tile-sub-title> 
                        <v-btn fab small absolute right @click="removeComment(comment._id)">
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </v-list-tile-content>
                      <v-divider></v-divider>
                    </template>  
                  </v-list>
                   <v-flex xs12>
                      <v-text-field
                        name="newComment"
                        label="Comment"
                        id="newComment"
                        v-model="text"
                        required
                        multi-line>
                      </v-text-field>
                    </v-flex>
                  </v-card-text>
                  <v-card-actions v-if="userIsAuthenticated">
                      <v-spacer></v-spacer>
                      <v-btn 
                        class="primary"
                        type="submit"
                        :disabled="!formIsValid">
                        Leave Comment
                      </v-btn>
                  </v-card-actions>
                   </form>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  data () {
    return {
      text: ''
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
    },
    formIsValid () {
      return this.text !== ''
    }
  },
  methods: {
    addRemoveBoulderToClimbed () {
      this.$store.dispatch('addRemoveBoulderToClimbed', this.boulder._id)
    },
    addComment () {
      this.$store.dispatch('addComment', {boulderId: this.id, text: this.text})
      this.text = ''
    },
    removeComment (commentId) {
      this.$store.dispatch('removeComment', {commentId, boulderId: this.boulder._id})
    }
  }
}
</script>

<style>

</style>
