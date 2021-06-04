import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


var ws = new WebSocket('wss://echo.websocket.org');

ws.onopen = function(evt) {
	evt;
	console.log('Connection open ...');
	ws.send('Hello WebSockets!');
};

ws.onmessage = function(evt) {
	console.log('Received Message: ' + evt.data);
	ws.close();
};

ws.onclose = function(evt) {
	evt;
	console.log('Connection closed.');
};

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
