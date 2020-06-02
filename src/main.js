import Vue from 'vue'
import App from './App.vue'
import router from './router'

import "./element-ui/elementCompents"
import TreeTable from "vue-table-with-tree-grid"

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

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')