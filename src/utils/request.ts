// 对axios进行二次封装
import axios from "axios";
// 引入用户相关的仓库
import useUserStore from "@/store/modules/user";
import { ElMessage } from "element-plus";
// 利用axios.create方法创建一个axios实例：可以设置基础路径、超时的时间设置
const request = axios.create({
  baseURL: '/api', // 请求的基础路径
  timeout: 5000, // 超时限制5秒，不管成功还是失败都在5秒之内完成
})
// 请求拦截器
request.interceptors.request.use((config)=>{
  // 获取用户仓库
  let userStore = useUserStore()
  if (userStore.userInfo.token) {
    config.headers.token = userStore.userInfo.token
  }
  // config:请求拦截器回调注入的对象(配置对象),配置对象的身上最终要的一件事情headers属性
  // 可以通过请求头携带公共参数-token
  return config
})
// 响应拦截器
request.interceptors.response.use((response)=>{
  // 响应拦截器成功的回调
  return response
},(error)=>{
  // 响应拦截器失败的回调
  // 处理http网络错误
  let status = error.response.status
  switch (status) {
    case 404:
      // 错误提示信息
      ElMessage({
        type:'error',
        message:'请求失败，路径出现问题'
      })
      break
    case 500 | 501 | 502 | 503 | 504 | 505:
      ElMessage({
        type: 'error',
        message: '服务器异常'
      })
      break
    case 401:
      ElMessage({
        type: 'error',
        message: '参数有误'
      })
      break
  }
  return Promise.reject(new Error(error.message))
})
// 对外暴露axios
export default request