import Api from '@/services/Api'
const FormData = require('form-data')

export default {
  state: {
    loadedBoulders: [],
    baseServerImageUrl: `http://localhost:7777/public/uploads/`,
    grades: [
      '', '3', '3+',
      '4', '4+',
      '5', '5A', '5A+', '5B', '5B+', '5C', '5C+',
      '6', '6A', '6A+', '6B', '6B+', '6C', '6C+',
      '7', '7A', '7A+', '7B', '7B+', '7C', '7C+',
      '8', '8A', '8A+', '8B', '8B+', '8C', '8C+'
    ]
  },
  mutations: {
    setLoadedBoulders (state, payload) {
      state.loadedBoulders = payload
    },
    createBoulder (state, payload) {
      state.loadedBoulders.push(payload)
    },
    deleteBoulder (state, payload) {
      state.loadedBoulders.splice(state.loadedBoulders.indexOf(payload), 1)
    },
    updateBoulder (state, payload) {
      console.log(payload)
      const boulder = state.loadedBoulders.find(boulder => {
        return boulder._id === payload._id
      })
      if (payload.name) {
        boulder.name = payload.name
      }
      if (payload.description) {
        boulder.description = payload.description
      }
      if (payload.grade) {
        boulder.grade = payload.grade
      }
    },
    addComment (state, payload) {
      const boulder = state.loadedBoulders.find(boulder => boulder._id === payload.boulder)
      if (boulder) {
        boulder.comments.push(payload)
      }
    },
    removeComment (state, payload) {
      const boulder = state.loadedBoulders.find(boulder => boulder._id === payload.boulderId)
      if (boulder) {
        const commentIndex = boulder.comments.findIndex(comment => comment._id === payload.commentId)
        boulder.comments.splice(commentIndex, 1)
      }
    },
    updateAvgRating (state, payload) {
      const boulder = state.loadedBoulders.find(boulder => boulder._id === payload.boulderId)
      if (boulder) {
        boulder.avgRating = payload.avgRating
      }
    }
  },
  actions: {
    async loadBoulders ({commit}) {
      commit('setLoading', true)
      try {
        const data = (await Api().get('boulders/')).data
        commit('setLoadedBoulders', data)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        console.log(error.response.data.message)
      }
    },
    async createBoulder ({commit, getters}, payload) {
      commit('setLoading', true)
      const token = localStorage.getItem('token')
      const boulder = {
        name: payload.name,
        grade: payload.grade,
        description: payload.description,
        creator: getters.user.id,
        gym: payload.gym
      }
      try {
        const form = new FormData()
        form.append('image', payload.image)
        form.append('name', boulder.name)
        form.append('grade', boulder.grade)
        form.append('creator', boulder.creator)
        form.append('gym', boulder.gym.id)
        form.append('description', boulder.description)
        const data = (await Api().post('boulders/', form, { headers: { 'Authorization': `bearer ${token}` } })).data
        if (data.success) {
          console.log(data)
          boulder._id = data.boulderId
          boulder.image = data.boulderImage
          boulder.creator = { _id: getters.user.id, username: getters.user.username }
          commit('createBoulder', boulder)
          commit('setLoading', false)
        } else {
          console.log(data)
        }
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
        commit('setError', error.response.data.message)
      }
    },
    async deleteBoulder ({commit}, payload) {
      commit('setLoading', true)
      try {
        await Api().delete(`boulders/${payload._id}`)
        commit('deleteBoulder', payload)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        console.log(error.response.data.message)
      }
    },
    async updateBoulder ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.grade) {
        updateObj.grade = payload.grade
      }
      try {
        await Api().patch(`boulders/${payload._id}`, updateObj)
        commit('updateBoulder', payload)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        console.log(error.response.data.message)
      }
    },
    async addComment ({commit, getters}, payload) {
      const user = getters.user
      try {
        const comment = (await Api().post(`comments`, {
          boulder: payload.boulderId,
          text: payload.text,
          author: user.id
        })).data.comment
        comment.author = user
        commit('addComment', comment)
      } catch (error) {
        commit('setError', error.response.data.message)
        // console.log(error.response.data.message)
        console.log(error)
      }
    },
    async removeComment ({commit}, payload) {
      const token = localStorage.getItem('token')
      try {
        await Api().delete(`comments/${payload.commentId}`, { headers: { 'Authorization': `bearer ${token}` } })
        commit('removeComment', {
          commentId: payload.commentId,
          boulderId: payload.boulderId
        })
      } catch (error) {
        commit('setError', error.response.data.message)
        console.log(error.response.data.message)
      }
    },
    async rateBoulder ({commit, getters}, payload) {
      const user = getters.user
      commit('setLoading', true)
      try {
        const data = (await Api().post(`reviews`, {
          boulder: payload.boulderId,
          rating: payload.rating,
          author: user.id
        })).data
        commit('setLoading', false)
        commit('updateAvgRating', {boulderId: payload.boulderId, avgRating: data.newAvgRating})
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        console.log(error.response.data.message)
      }
    }
  },
  getters: {
    loadedBoulders (state) {
      return state.loadedBoulders.sort((boulderA, boulderB) => {
        return boulderA.grade > boulderB.grade
      })
    },
    loadedBoulder (state) {
      return (boulderId) => {
        return state.loadedBoulders.find((boulder) => {
          return boulder._id === boulderId
        })
      }
    },
    featuredBoulders (state, getters) {
      return getters.loadedBoulders.slice(0, 5)
    },
    baseServerImageUrl (state) {
      return state.baseServerImageUrl
    },
    grades (state) {
      return state.grades
    }
  }
}
