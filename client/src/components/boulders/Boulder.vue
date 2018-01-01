<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-card-title class="primary--text">
                        {{ boulder.name }}
                    </v-card-title>
                     <v-card-media
                        :src="boulder.image"
                        height="600px">
                </v-card-media>
                <v-card-text>
                    <div> some date and some text </div>
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type ... There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised ...
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
      console.log(this.$store.getters.loadedBoulder(this.id))
      return this.$store.getters.loadedBoulder(this.id)
    }
  }
}
</script>

<style>

</style>
