<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-text-field type="text" v-model="search" placeholder="Search boulders"></v-text-field>
      </v-flex> 
    </v-layout>
    <v-layout row wrap  v-for="boulder in filteredBoulders" :key="boulder._id" class="mb-2">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card class="info">
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm3 md3 class="container">
                <v-card-media
                  :src="baseServerImageUrl + boulder.image"
                  @click="$router.push(`/boulder/${boulder._id}`)"
                  :class="classesImage(boulder._id)"
                  height="130px">
                </v-card-media>
                <div :class="classes(boulder._id)">
                  <v-icon x-large>done</v-icon>
                </div>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-card-title primary-title>
                   <div class="text-xs-left">
                    <h3 class="headline mb-0">{{ boulder.name }}</h3>
                    <span v-if="boulder.grade"> Grade: {{ boulder.grade }}</span><br>
                    <span v-if="boulder.description"> Comment: {{ boulder.description }}</span><br>
                    <span v-if="boulder.avgRating"> Avg rating: {{ boulder.avgRating }}</span><br>
                    <span> Author: {{ boulder.creator.username }}</span>
                  </div>
                </v-card-title>
                 <v-card-actions>
                  <v-btn flat @click="deleteBoulder(boulder)" v-if="userIsCreator(boulder)">Delete</v-btn>
                  <v-btn flat @click="addRemoveBoulderToClimbed(boulder._id)" v-if="userIsAuthenticated">
                        {{ !userClimbed(boulder._id) ? 'Add to climbed' : 'Remove from climbed' }}
                    </v-btn>
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
export default {
  data () {
    return {
      search: ''
    }
  },
  computed: {
    boulders () {
      console.log(this.$store.getters.loadedBoulders)
      return this.$store.getters.loadedBoulders
    },
    baseServerImageUrl () {
      return this.$store.getters.baseServerImageUrl
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
    filteredBoulders () {
      console.log(this.search)
      if(this.search) {
        return this.boulders.filter(boulder => {
          return (boulder.grade === this.search || 
            boulder.creator.username === this.search)
        })
      } else {
        return this.boulders
      } 
    }
  },
  methods: {
    deleteBoulder (boulder) {
      this.$store.dispatch('deleteBoulder', boulder)
      this.$router.push('/boulders')
    },
    addRemoveBoulderToClimbed (boulderId) {
      this.$store.dispatch('addRemoveBoulderToClimbed', boulderId)
    },
    userIsCreator (boulder) {
      if (!this.userIsAuthenticated) {
        return false
      }
      return this.$store.getters.user.id === boulder.creator._id
    },
    classes (boulderId) {
      let classes = 'notClimbed'
      if (this.userClimbed(boulderId)) {
        classes = 'climbed'
      }
      return classes
    },
    classesImage (boulderId) {
      let classes = 'clickable'
      if (this.userClimbed(boulderId)) {
        classes += ' climbedImage'
      }
      return classes
    },
    userClimbed (id) {
      // check if boulderId is in the arrray (value is -1 if not)
      if (!this.userIsAuthenticated) {
        return false
      }
      return this.$store.getters.user.climbedBoulders.findIndex(boulderId => {
        return boulderId === id
      }) >= 0
    }
  }
}
</script>

<style scoped>
  .clickable { 
    cursor: pointer;
  }

  .clickable:hover { 
    opacity: .7;
  }

  .climbed {
    position: absolute;
    bottom: 15px;
    right: 16px;
  }

  .notClimbed {
    visibility: hidden;
    position: absolute;
    bottom: 15px;
    right: 16px;
  } 

  .climbedImage {
    border:greenyellow;
    border-style: solid;
  }

  .container {
    position: relative;
    text-align: center;
    color: white;
  }
  
</style>
