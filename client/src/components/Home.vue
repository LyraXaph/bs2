<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large router to="/boulders" info>Explore boulders</v-btn>  
      </v-flex>
       <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large router to="/boulders/new" info>Add boulder</v-btn>  
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 class="text-xs-center">
          <v-progress-circular
           indeterminate color="purple"
           :width="7"
           :size="70"
           v-if="loading">
           </v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-2" v-if="!loading">
      <v-flex xs12>
        <v-carousel style="cursor:pointer">
          <v-carousel-item
            v-for="(boulder, i) in boulders" 
            v-bind:src="'http://localhost:7777/public/uploads/' + boulder.image"
            :key="boulder._id"
            @click="onLoadBoulder(boulder.id)">
            <div class="title">
              {{ boulder.name }}
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
     <v-layout row wrap class="mt-3">
      <v-flex xs12 class="text-xs-center">
        <p>Live life to the fullest!</p>  
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    boulders () {
      return this.$store.getters.featuredBoulders
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onLoadBoulder (id) {
      this.$router.push('/boulder/' + id)
    }
  }
}
</script>

<style scoped>
  .title{
    position: absolute;
    bottom: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    font-size: 2em;
    padding: 20px;
  }
</style>
