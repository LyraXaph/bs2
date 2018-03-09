<template>
    <v-dialog width="350px" persistent v-model="editDialog">
        <v-btn fab accent slot="activator"> 
            <v-icon>edit</v-icon>
        </v-btn>
        <v-card v-if="!loading">
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>
                            Edit user
                        </v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                 <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-text>
                                <v-text-field
                                    name="name"
                                    label="Name"
                                    id="name"
                                    v-model="editedName">
                                </v-text-field>
                                 <v-text-field
                                    name="lastname"
                                    label="Lastname"
                                    id="lastname"
                                    v-model="editedLastname">
                                </v-text-field>
                                <v-select
                                    v-bind:items="gyms"
                                    v-model="user.gym.id"
                                    label="Gym"
                                    required
                                    autocomplete
                                    ref="gyms"
                                    :value="user.gym.id">
                                </v-select>
                        </v-card-text>
                    </v-flex>
                </v-layout>
                 <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-actions>
                            <v-btn flat @click="editDialog=false">
                                Close
                            </v-btn>
                             <v-btn flat @click="onSaveChanges">
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-flex>
                 </v-layout>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
import Api from '@/services/Api'
export default {
  props: ['user'],
  data () {
    return {
      editDialog: false,
      editedName: this.user.name,
      editedLastname: this.user.lastname,
      gyms: null,
      loading: true
    }
  },
  methods: {
    onSaveChanges () {
      if (!this.$refs.gyms.value) {
        return
      }
      this.editDialog = false
      this.$store.dispatch('updateUser', {
        fieldsToEdit: [
            { 'propName': 'name', 'value': this.editedName },
            { 'propName': 'lastname', 'value': this.editedLastname },
            { 'propName': 'gym', 'value': this.user.gym.id }
        ],
        userId: this.user.id
      })
    }
  },
  async mounted () {
    this.loading = true
    try {
      this.gyms = (await Api().get(`gyms/`)).data
        .map(gym => { return {'text': gym.name, 'value': gym._id} })
      this.loading = false
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style>

</style>
