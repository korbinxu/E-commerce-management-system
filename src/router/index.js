import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Login = () => import("../views/login/Login.vue")
const Home = () => import("../views/home/Home.vue")
const Welcome = () => import("../views/home/childrenComps/Welcome.vue")
const Users = () => import("../views/user/Users")
const Rights = () => import("../views/power/Rights")
const Roles = () => import("../views/power/Roles")
const Cate = () => import('../views/goods/Cate')
const Params = () => import("../views/goods/Params")
const List = () => import("../views/goods/List")
const Add = () => import("../views/goods/Add")
const Order = () => import("../views/order/Order")
const Report = () => import("../views/report/Report")

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
			{
				path: "/params",
				component: Params
			},
			{
				path: "/goods",
				component: List
			},
			{
				path: "/goods/add",
				component: Add
			},
			{
				path: "/orders",
				component: Order
			},
			{
				path: "/reports",
				component: Report
			}
		]
	},

]

const router = new VueRouter({
	mode: "history",
	routes
})

export default router