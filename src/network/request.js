import axios from "axios";

const url = "http://timemeetyou.com:8889/api/private/v1/"

let config = {
	baseURL: url,
	timeout: 5000
}
// 创造请求实例
const _axios = axios.create(config);

// 请求拦截
_axios.interceptors.request.use(config => { return config }, err => { err })
// 返回拦截
_axios.interceptors.response.use(result => { return result }, err => { err })

// 导出
export { _axios }
