import Api from '@/services/Api'

export default {
  state: {
    user: null,
    token: null,
    isLoggedIn: !!localStorage.getItem('token')
  },
  mutations: {
    addRemoveBoulderToClimbed (state, payload) {
      const boulderIndex = state.user.climbedBoulders.findIndex(boulderId => boulderId === payload)
      if (boulderIndex >= 0) {
        state.user.climbedBoulders.splice(boulderIndex, 1)
      } else {
        state.user.climbedBoulders.push(payload)
      }
    },
    setUser (state, payload) {
      state.user = payload
    },
    setToken (state, payload) {
      state.token = payload
      state.isLoggedIn = true
    },
    setIsLoggedIn (state, payload) {
      state.isLoggedIn = payload
    }
  },
  actions: {
    async addRemoveBoulderToClimbed ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      try {
        await Api().post(`users/${user.id}/climbedBoulders/${payload}`)
        commit('setLoading', false)
        commit('addRemoveBoulderToClimbed', payload)
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
          gym: user.gym
        }
        commit('setUser', newUser)
        commit('setToken', response.data.token)
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
        const newUser = {
          id: user.id,
          climbedBoulders: user.climbedBoulders,
          gym: user.gym
        }
        localStorage.setItem('token', response.data.token)
        commit('setUser', newUser)
        commit('setToken', response.data.token)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        console.log(error.response.data.message)
      }
    },
    async autoSignIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      const token = localStorage.getItem('token')
      try {
        const response = await Api().get('users/autoSignIn', { headers: { 'Authorization': `bearer ${token}` } })
        commit('setUser', response.data.user)
        commit('setToken', token)
        commit('setLoading', false)
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
        commit('setError', error.response.data.message)
      }
    },
    async updateUser ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      try {
        const response = await Api().patch(`users/${payload.userId}`, payload.fieldsToEdit)
        commit('setUser', response.data.user)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        console.log(error.response.data.message)
      }
    },
    logout ({commit}) {
      localStorage.removeItem('token')
      commit('setUser', null)
      commit('setToken', null)
      commit('setIsLoggedIn', false)
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    token (state) {
      return state.token
    },
    isLoggedIn (state) {
      return state.isLoggedIn
    }
  }
}
