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
      <v-flex xs12>
        <v-carousel>
          <v-carousel-item
            v-for="(boulder, i) in boulders" 
            v-bind:src="boulder.image"
            :key="boulder.id">
            <div class="title">
              {{ boulder.title }}
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
  data () {
    return {
      boulders: [
        { image: 'https://spotsettingblog.files.wordpress.com/2012/08/img_1469.jpg', id: 'blabla', title: 'Toughest' },
        { image: 'http://www.xtremego.com/wp-content/uploads/2014/05/xtremgo-4-925x320.jpg', id: 'blablsdasaa', title: 'EasyOne' },
        { image: 'http://4.bp.blogspot.com/-1dc_dPrvLd8/VFeue1fQ67I/AAAAAAAAAPY/5u8m8PG2oqA/s1600/PLafon.jpg', id: 'sdasdablabla', title: 'Middle ground' }
      ]
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
