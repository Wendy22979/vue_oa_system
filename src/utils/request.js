import axios from 'axios'
import { Message } from 'element-ui';
import store from "@/store"
import {getTimeStamp} from '@/utils/auth'
import router from '@/router';

// 创建实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,//开发环境的基地址，调取env.development文件中的使用
  timeout:5000  //定义5秒超时
})

// 请求拦截
// 添加请求拦截器
service.interceptors.request.use(function (config) {
  if(store.getters.token){
    config.headers['Authorization']=`Bearer ${store.getters.token}`

    // token失效主动处理
    //  if(!IsCheckTimeOut()){//没过期
    //    // 如果token存在  把token设置到请求头上
    //  config.headers['Authorization']=`Bearer ${store.getters.token}`
    //  } else {//过期了
    //   // 执行退出操作,即删除用户信息，token存储，然后跳转登录页面
    //   store.dispatch("user/loginout")
    //   router.push("/login")
    //   return Promise.reject(new Error("登录过期了"))
    //  }
    
  }

  return config;
}, function (error) {
  return Promise.reject(error);
});

// 添加响应拦截器,将响应结果处理了再传回
service.interceptors.response.use(function (response) {//响应成功
  let {success,message,data} = response.data
  if(success){
    return data;
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))  //把错误传回
  }
  
}, function (error) {//响应失败
  // 被动token失效处理,10002是token失效
  if(error.response && error.response.data && error.response.data.code === 10002){
    store.dispatch('user/loginout')
    router.push('/login')
  }
  Message.error(error.message)
  return Promise.reject(error);
});



// // 定义超时时间,单位为秒
// const TimeOut = 1000

// // 定义检查时间戳是否失效的函数
// function IsCheckTimeOut(){
//   let time = getTimeStamp();//获取时间戳
//   return (Date.now() - time)/1000 > TimeOut 
// }


export default service

