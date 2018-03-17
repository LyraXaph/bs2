<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h2 class="primary--text">Add a new Boulder</h2>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreateBoulder" v-if="!loading">
          <v-layout row >
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="name"
                label="Name"
                id="name"
                v-model="name">
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
           <v-flex xs12 sm6 offset-sm3>
              <v-select
                name="grade"
                :items="grades"
                label="Grade"
                id="grade"
                v-model="grade">
              </v-select>
           </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 sm6 offset-sm3>
             <v-select
                label="Gym"
                :items="gyms"
                required
                autocomplete
                v-model="gym"
                ref="gyms">
            </v-select>
            </v-flex>
          </v-layout>
          <v-layout>
           <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="description"
                label="Comment"
                id="description"
                v-model="description"
                multi-line>
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
              required
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
import Api from '@/services/Api'
export default {
  data () {
    return {
      name: '',
      grade: '',
      description: '',
      image: '',
      rawImage: '',
      gyms: null,
      user: this.$store.getters.user,
      loading: true,
      gym: null,
      grades: this.$store.getters.grades
    }
  },
  computed: {
    formIsValid () {
      return this.$refs.gyms !== ''
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
        image: this.rawImage,
        gym: {name: this.$refs.gyms.selectedItem.text, id: this.$refs.gyms.selectedItem.value}
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
  },
  async mounted () {
    try {
      this.gyms = (await Api().get(`gyms/`)).data
        .map(gym => { return {'text': gym.name, 'value': gym._id} })
      this.loading = false
    } catch (err) {
      console.log(err)
    }
    this.gym = {'text': this.$store.getters.user.gym.name, 'value': this.$store.getters.user.gym._id}
  }
}
</script>

<style>

</style>
