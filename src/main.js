import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

// 引入所有的字体图标
import '@/icons' // icon

// 引入字体图标
import '@/assets/fonts/iconfont.css'

// 全局混入
import mixin from '@/mixin'
Vue.mixin(mixin)

import '@/icons' // icon
import '@/permission' // permission权限管理
// 打印插件
import Print from 'vue-print-nb'
Vue.use(Print)

import plugins from './plugins'// 自定义插件
Vue.use(plugins)

// echarts
import echarts from '@/utils/echarts'
Vue.prototype.$echarts = echarts
// Vue.use(echarts)

// 语言切换插件
import i18n from '@/utils/i18n/index'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// 显示英文方式
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

// const app = createApp(App);
// app.use(router);
// app.use(store);
// app.mount('#app');
