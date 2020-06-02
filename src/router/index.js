import Vue from 'vue'
import VueRouter from 'vue-router'

import Welcome from "../views/home/childrenComps/Welcome.vue"
import Users from "../views/user/Users"
import Rights from "../views/power/Rights"
import Roles from "../views/power/Roles"
import Cate from '../views/goods/Cate';

// 路由懒加载
const Login = () => import("../views/login/Login.vue")
const Home = () => import("../views/home/Home.vue")

Vue.use(VueRouter)

const routes = [{
		path: "/",
		redirect: "/login"
	},
	{
		path: "/login",
		component: Login
	},
	{
		path: "/home",
		redirect: "/welcome",
		component: Home,
		children: [{
				path: "/welcome",
				component: Welcome
			},
			{
				path: "/users",
				component: Users
			},
			{
				path: "/rights",
				component: Rights
			},
			{
				path: "/roles",
				component: Roles
			},
			{
				path: "/categories",
				component: Cate
			},
		]
	},

]

const router = new VueRouter({
	mode: "history",
	routes
})

// 拦截导航守卫
router.beforeEach((to, from, next) => {
	if (to.path === "/login") return next()
	const hasToken = window.sessionStorage.getItem("token")
	if (!hasToken) return next("/login")
	next()
})

export default router