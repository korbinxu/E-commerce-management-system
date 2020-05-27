import { _axios } from "./request"

export function loginRequest(data) {
	return _axios({
		method: "post",
		url: "login",
		data
	})
}