import Vue from 'vue'
import App from './App.vue'
import router from './router'

import "./element-ui/elementCompents"
// 树形结构
import TreeTable from "vue-table-with-tree-grid"
// 富文本编译器
import VueQuillEditor from 'vue-quill-editor'
// 富文本样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


// 全局样式
import "./assets/css/global.css"
// 登录框小图标
import "./assets/font/iconfont.css"
// 左侧菜单图标
import "./assets/font_iconObj/iconfont.css"

// 网络请求
import axios from "axios"
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"
// 挂载请求头
axios.interceptors.request.use(config => {
	config.headers.Authorization = window.sessionStorage.getItem("token")
	return config
})
Vue.prototype.$http = axios

// 全局注册组件
Vue.component("TreeTable", TreeTable)
// 注册VueQuillEditor富文本编译器
Vue.use(VueQuillEditor)



// 过滤器
Vue.filter("dataFormat", function (originVal) {
	const dt = new Date(originVal * 1000)
	const y = dt.getFullYear()
	// const m = (dt.getMonth() + 1 + "").padStart(2, " ")
	const m = ("0" + (dt.getMonth() + 1)).slice(-2)
	const d = ("0" + dt.getDate()).slice(-2)
	const hh = ("0" + dt.getHours()).slice(-2)
	const mm = ("0" + dt.getMinutes()).slice(-2)
	const ss = ("0" + dt.getSeconds()).slice(-2)
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')