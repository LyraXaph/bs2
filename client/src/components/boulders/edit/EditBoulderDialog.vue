<template>
    <v-dialog width="350px" persistent v-model="editDialog">
        <v-btn fab accent slot="activator"> 
            <v-tooltip top>
                <v-icon slot="activator">edit</v-icon>
                <span>Edit boulder</span>
            </v-tooltip>
        </v-btn>
        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>
                            Edit boulder
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
                                <v-select
                                    name="grade"
                                    :items="grades"
                                    label="Grade"
                                    id="grade"
                                    v-model="editedGrade">
                                </v-select>
                                <v-text-field
                                    name="description"
                                    label="Description"
                                    id="description"
                                    v-model="editedDescription"
                                    multi-line>
                                </v-text-field>
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
export default {
  props: ['boulder'],
  data () {
    return {
      editDialog: false,
      editedName: this.boulder.name,
      editedDescription: this.boulder.description,
      editedGrade: this.boulder.grade,
      grades: this.$store.getters.grades
    }
  },
  methods: {
    onSaveChanges () {
     /* if (this.editedName.trim() === '' ||
       this.editedDescription === '' ||
       this.editGrade === '') {
        return
      } */
      this.editDialog = false
      this.$store.dispatch('updateBoulder', {
        _id: this.boulder._id,
        name: this.editedName,
        grade: this.editedGrade,
        description: this.editedDescription
      })
    }
  }
}
</script>

<style>

</style>
