import axios from 'axios'
import { Message } from 'element-ui';

// const instance = axios.create({
//     baseURL: 'http://localhost:3000', // api的base_url
//     timeout: 10000 // 请求超时时间
//     // transformRequest: data => qs.stringify(data) //
// })
// request拦截器
axios.interceptors.request.use(
    e => {
        e.params = e.params || {}
        e.headers = e.headers || {}
        console.log(e);
        //set 默认值
        return e
    },
    error => ({ status: 0, msg: error.message })
)
// respone拦截器
axios.interceptors.response.use(
    response => {
        // console.log(response);
        const resp = response.data
        if (response.status === 200) {
            return resp
            // return Promise.resolve(resp)
        }
        return resp
    },
    error => {
        // console.log(error);
        Message.error({
            message: '链接异常'
        })
        return Promise.reject(error)
    }
)
export default axios