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
                        <v-spacer></v-spacer>
                        <v-btn fab @click="addRemoveBoulderToClimbed">
                          <v-tooltip top>
                            <v-icon slot="activator"> {{ !userClimbed ? 'trending_up' : 'trending_down' }}</v-icon>
                            <span> {{ !userClimbed ? 'Add to climbed boulders' : 'Remove from climbed boulders' }}</span>
                          </v-tooltip>
                        </v-btn>
                        <template v-if="userIsCreateor">
                            <app-edit-boulder-dialog :boulder="boulder"></app-edit-boulder-dialog>
                        </template>
                    </v-card-title>
                     <v-card-media
                        :src="baseServerImageUrl + boulder.image"
                        height="600px">
                </v-card-media>
                <v-card-text>
                    <v-layout row>
                      <v-flex xs8>
                        <strong> Author's comment:</strong> {{ boulder.description }}</br> 
                        <span class="text-xs-left">Grade by author: {{ boulder.grade }} </span></br>
                        <span class="text-xs-right">Avg grade: {{ boulder.grade }}</span></br>
                        <span class="text-xs-right">Avg rating: {{ boulder.avgRating }}</span></br>
                        <span class="text-xs-right">Gym: {{ boulder.gym.name }}</span>
                      </v-flex>
                      <v-flex xs4>
                        <v-layout justify-end>
                          <v-card-actions v-if="userIsAuthenticated">
                            <form class="reviewer" @submit.prevent="rateBoulder">
                              <div class="reviewer__meta">
                                  <div class="reviewer__stars" >
                                    <template v-for="i in numbers">
                                      <input 
                                        type="radio"
                                        required 
                                        name="rating"
                                        v-model="rating"
                                        :value="i"
                                        :ref="'star' + i"
                                        :key="i"
                                        :id="'star' + i">
                                      <label :for="'star' + i"></label>
                                    </template>
                                  </div>
                                </div>
                                <v-btn 
                                  class="primary"
                                  type="submit">
                                  Rate boulder
                                </v-btn>
                            </form>
                          </v-card-actions>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                </v-card-text>
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
                      <v-list-tile v-bind:key="comment._id" >
                        <v-list-tile-avatar>
                          <v-btn fab small absolute left @click="removeComment(comment._id)">
                              <v-icon>delete</v-icon>
                            </v-btn>
                        </v-list-tile-avatar>
                        <v-list-tile-content >
                          <v-list-tile-title v-html="comment.author.name"></v-list-tile-title>
                          <v-list-tile-sub-title v-html="comment.text"></v-list-tile-sub-title> 
                        </v-list-tile-content>
                      </v-list-tile>
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
                    <v-btn 
                        class="primary"
                        type="submit"
                        :disabled="!formIsValid">
                        Leave Comment
                      </v-btn>
                   </form>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
// import Api from '@/services/Api'
export default {
  data () {
    return {
      text: '',
      rating: '',
      avgRating: '',
      numbers: [5, 4, 3, 2, 1]
    }
  },
  props: ['id'],
  computed: {
    starId (i) {
      return `stars${i}`
    },
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
    },
    rateBoulder () {
      this.$store.dispatch('rateBoulder', {boulderId: this.boulder._id, rating: this.rating})
    }
  },
  mounted () {
    console.log(this.boulder)
    if (this.userIsAuthenticated) {
      let userRating = null
      let userReview = null
      if (this.boulder.reviews) {
        userReview = this.boulder.reviews.find(review => review.author === this.$store.getters.user.id)
      }
      if (userReview) { userRating = userReview.rating }
      for (let i = 1; i <= userRating; i++) {
        this.$refs[`star${i}`][0].checked = true
      }
    }
  }
}
</script>

<style>
  
</style>
