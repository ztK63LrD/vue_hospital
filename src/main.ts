import { createApp } from 'vue'
import App from '@/App.vue'
import '@/style/reset.scss'
// import 'reset.css'

// 引入全局组件——顶部组件
import HospitalTop from '@/components/hospital_top/index.vue'
// 引入全局组件——底部组件
import HospitalBottom from '@/components/hospital_bottom/index.vue'
// 引入vue-router核心插件并安装
import router from '@/router'
// 引入element-plus插件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入国际化样式
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 引入pinia仓库
import pinia from '@/store'
// 引入svg插件配置
import 'virtual:svg-icons-register'
// 引入自定义插件对象，注册整个项目的全局组件
import gloablComponent from '@/components'
// 引入路由鉴权的文件
import '@/utils/permisstion'

const app = createApp(App)
app.component('HospitalTop', HospitalTop)
app.component('HospitalBottom', HospitalBottom)
// 安装vue-router
app.use(router)
// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn,
})
// 安装pinia仓库
app.use(pinia)
// 安装自定义插件
app.use(gloablComponent)

app.mount('#app')
