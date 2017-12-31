import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedBoulders: [
      {
        image: 'https://spotsettingblog.files.wordpress.com/2012/08/img_1469.jpg',
        id: 'blabla',
        title: 'Toughest',
        grade: 3
      },
      {
        image: 'http://www.xtremego.com/wp-content/uploads/2014/05/xtremgo-4-925x320.jpg',
        id: 'blablsdasaa',
        title: 'EasyOne',
        grade: 13
      },
      {
        image: 'http://4.bp.blogspot.com/-1dc_dPrvLd8/VFeue1fQ67I/AAAAAAAAAPY/5u8m8PG2oqA/s1600/PLafon.jpg',
        id: 'sdasdablabla',
        title: 'Middle ground',
        grade: 10
      }
    ],
    user: {
      id: 'dnlaksnda',
      climbedBoulders: [],
      gymId: 's;dnasldnal'
    }
  },
  mutations: {},
  actions: {},
  getters: {
    loadedBoulders (state) {
      return state.loadedBoulders.sort((boulderA, boulderB) => {
        return boulderA.grade > boulderB.grade
      })
    },
    loadedBoulder (state) {
      return (boulderId) => {
        return state.loadedBoulders.find((boulder) => {
          return boulder.id === boulderId
        })
      }
    },
    featuredBoulders (state, getters) {
      return getters.loadedBoulders.slice(0, 5)
    }
  }
})
