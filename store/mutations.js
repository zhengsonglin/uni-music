import state from './state'
const mutations = {
	login(state, provider) {
		state.hasLogin = true;
		state.loginProvider = provider;
	},
	logout(state) {
		state.hasLogin = false
		state.openid = null
	},
	setOpenid(state, openid) {
		state.openid = openid
	},
	
/* 	setDisc(state, disc) {
		state.disc = disc
	},
	setSinger(state, singer) {
		state.singer = singer
	},
	setTopList(state, topList) {
		state.topList = topList
	}, */
}

//自动创建与state同名的，以set开头的mutation方法
let stateKeys = Object.keys(state);
let mutationsFuns = {};
stateKeys.map(item => {
  let prex = item.substr(0, 1);
  prex = prex.toUpperCase();
  let _next = item.substr(1);
  mutationsFuns['set' + prex + _next] = (state, payload) => {
    state[item] = payload;
  }
})

export default Object.assign(mutations, mutationsFuns)