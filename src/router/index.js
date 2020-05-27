import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Login = () => import("../views/Login.vue")
const Home = () => import("../views/Home.vue")

Vue.use(VueRouter)

const routes = [
	{
		path: "/",
		redirect: "/login"
	},
	{
		path: "/login",
		component: Login
	},
	{
		path: "/home",
		component: Home
	}
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
