import Vue from 'vue'
import Vuex from 'vuex'

import state from './state.js'
import * as getters from './getters.js'
import mutations from './mutations.js'
import * as actions from './actions.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state,
	getters,
	mutations,
	actions
})

export default store
