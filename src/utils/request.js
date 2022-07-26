import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// request interceptor
service.interceptors.request.use(config => {
  if (store.getters.token) {
    if (CheckTimeOut()) {
      console.log(CheckTimeOut())
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token超时'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  //   要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

function CheckTimeOut() {
  var currenTime = Date.now()
  var timeStamp = getTimeStamp()
  return (currenTime - timeStamp) / 1000 > TimeOut
}
export default service
