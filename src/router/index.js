import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Users from '../views/users/users.vue'
Vue.use(VueRouter)

const routes = [{
		path: '/home',
		name: 'Home',
		component: Home
	},
	// {
	// 	path: '/Menu/:room_id&:user_id',
	// 	name: 'menu',
	// 	// route level code-splitting
	// 	// this generates a separate chunk (about.[hash].js) for this route
	// 	// which is lazy-loaded when the route is visited.
	// 	component: () => import( /* webpackChunkName: "about" */ '../views/Menu.vue')
	// },
	{
		path: '/',
		name: 'login',
		component: Login,
		props: {
			user: true
		}
	}, 
	{
		path: '/users',
		name: 'Users',
		component: Users,
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
