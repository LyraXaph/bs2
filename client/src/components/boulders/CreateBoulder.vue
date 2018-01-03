<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h4 class="primary--text">Add a new Boulder</h4>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreateBoulder">
          <v-layout row >
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="name"
                label="Name"
                id="name"
                v-model="name"
                required>
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
           <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="grade"
                label="Grade"
                id="grade"
                v-model="grade"
                required>
              </v-text-field>
           </v-flex>
          </v-layout>
          <v-layout>
           <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="description"
                label="Description"
                id="description"
                v-model="description"
                multi-line
                required>
              </v-text-field>
           </v-flex>
          </v-layout>
          <v-layout>
           <v-flex xs12 sm6 offset-sm3>
              <v-btn raised class="primary" @click="onPickFile">
                Upload image
              </v-btn>
           <input 
              type="file"
              style="display:none"
              ref="fileInput"
              accept="image/*"
              @change="onFilePicked">
           </v-flex>
          </v-layout>
          <v-layout>
           <v-flex xs12 sm6 offset-sm3>
            <img
              :src="image"
              height="200"
              >
            </v-flex>
           </v-layout>
          <v-layout>
           <v-flex xs12 sm6 offset-sm3>
              <v-btn 
                class="primary" 
                type="submit"
                :disabled="!formIsValid">
                Add boulder
              </v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      grade: '',
      description: '',
      image: 'http://boulderrockclub.com/wp-content/uploads/2012/08/laura-910x340.jpg',
      rawImage: ''
    }
  },
  computed: {
    formIsValid () {
      return this.title !== '' &&
        this.grade !== '' &&
        this.description !== '' &&
        this.image !== ''
    }
  },
  methods: {
    onCreateBoulder () {
      if (!this.formIsValid) {
        return
      }
      if (!this.rawImage) {
        return
      }
      const boulderData = {
        name: this.name,
        grade: this.grade,
        description: this.description,
        image: this.rawImage
      }
      this.$store.dispatch('createBoulder', boulderData)
      this.$router.push('/boulders')
    },
    onPickFile () {
      return this.$refs.fileInput.click()
    },
    onFilePicked (event) {
      const files = event.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Please add a valid file!')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.image = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.rawImage = files[0]
    }
  }
}
</script>

<style>

</style>
