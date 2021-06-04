<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png">
		<HelloWorld msg="Welcome to Your Vue.js App" />
		<el-button type="primary" @click="testAxios()">测试axios调用</el-button>
		<el-button type="primary" @click="getUser()">获取用户信息</el-button>
		<el-button type="primary" @click="getMenu()">获取菜单信息</el-button>
	</div>
</template>

<script>
	// @ is an alias to /src
	import HelloWorld from '@/components/HelloWorld.vue'
	import axios from 'axios'
	// import mock from '@/mock/mock.js'
	// import Vue from 'vue'
	// Vue.use(mock)
	export default {
		name: 'Home',
		components: {
			HelloWorld
		},
		methods: {
			testAxios() {
				axios.get('http://localhost:8080').then(function(res) {
					alert(res.data);
				}).catch(function(res) {
					alert(res);
				});
			},
			getUser() {
				axios.get('http://localhost:8080/user').then(function(res) {
					alert(JSON.stringify(res.data));
				}).catch(function(res) {
					alert(res);
				});
			},
			getMenu() {
				axios.get('http://localhost:8080/menu').then(function(res) {
					alert(JSON.stringify(res.data));
				}).catch(function(res) {
					alert(res);
				});
			}
		}
	}
</script>
