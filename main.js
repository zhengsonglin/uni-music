import Vue from 'vue'
import App from './App'

import pageHeader from './components/page-header.vue'
import pageTab from './components/page-tab.vue'
import {ERR_OK} from './pages/api/config.js'

import VueLazyLoad from 'vue-lazyload'
import store from './store'

Vue.prototype.$store = store
Vue.config.productionTip = false

Vue.component("page-tab-top",pageTab)
Vue.component("page-header",pageHeader)

Vue.prototype.ERR_OK = ERR_OK	//全局接口返回正常code
Vue.use(VueLazyLoad, {
	loading: require('@/static/images/default.png')
})

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
