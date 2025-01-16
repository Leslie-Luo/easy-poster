import axios, { type InternalAxiosRequestConfig } from 'axios'
import { errorCodeType } from '@/utils/error-code-type'
import { MessagePlugin } from 'tdesign-vue-next'

// 创建axios实例
const instance = axios.create({
  // 服务接口请求
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时设置
  // timeout: 15000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
})

// 请求拦截器
// 1.请求拦截器，在发请求之前，请求拦截器可以检测到发起请求之前需要做什么事情，把需要做的事情，放在请求拦截器之前
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  console.log('[ config ]-17-「utils/axios.ts」', config)
  // 1.这里我设置了，在请求之前，先开始进度条的动画
  // 2.返回请求数据
  config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
  return config
})

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data['code'] || 200
    // 获取错误信息
    const msg = errorCodeType(code) || res.data['msg'] || errorCodeType('default')
    if (code === 200) {
      return Promise.resolve(res.data)
    } else {
      MessagePlugin.error(msg)
      return Promise.reject(res.data)
    }
  },
  (error) => {
    console.log('err' + error)
    let { message } = error
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    MessagePlugin.error(message, 5 * 1000)
    return Promise.reject(error)
  },
)

export default instance
