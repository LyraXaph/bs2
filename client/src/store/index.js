import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/services/Api'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedBoulders: [],
    user: null,
    loading: false,
    error: null
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
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
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
        commit('setLoading', false)
      }
    },
    async createBoulder ({commit}, payload) {
      const boulder = {
        title: payload.name,
        grade: payload.grade,
        image: payload.image,
        description: payload.description
      }
      try {
        const data = (await Api().post('boulders/', payload)).data
        boulder._id = data.boulderId
        commit('createBoulder', boulder)
        console.log(data)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        console.log(error.response.data.message)
      }
    },
    async deleteBoulder ({commit}, payload) {
      try {
        await Api().delete(`boulders/${payload._id}`)
        commit('deleteBoulder', payload)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        console.log(error.response.data.message)
      }
    },
    async registerUser ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      try {
        const response = await Api().post('users/register', payload)
        const user = response.data.user
        commit('setLoading', false)
        const newUser = {
          id: user.id,
          climbedBoulders: [],
          gymId: user.gym
        }
        commit('setUser', newUser)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        // console.log(error.response.data.message)
      }
    },
    async signInUser ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      try {
        const response = await Api().post('users/login', payload)
        const user = response.data.user
        commit('setLoading', false)
        const newUser = {
          id: user.id,
          climbedBoulders: [],
          gymId: user.gym
        }
        commit('setUser', newUser)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        // console.log(error.response.data.message)
      }
    },
    clearError ({commit}) {
      commit('clearError')
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
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
})
