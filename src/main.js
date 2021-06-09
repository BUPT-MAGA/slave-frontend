import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import store from './store'

import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';


Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vuex)


new Vue({
	router,
	store: store,
	render: h => h(App)
	
}).$mount('#app')
