// 自定义插件用于全局注册
import * as directive from "@/directive" //引入自定义指令
import  * as filters from '@/filters' //过滤器引入
import PageTools from "@/components/PageTools" //全局注册组件PageTools
import  UploadExcel from  "@/components/UploadExcel"//全局注册组件PageTools
import ImageUpload from "@/components/ImageUpload"//创建上传图片全局组件


const plugins = {
  install(Vue){
     // 全局注册自定义指令
    for(let key in directive){
      Vue.directive(key,directive[key])
    }

        // 全局注册过滤器
    for(let key in filters){
      Vue.filter(key,filters[key])
    }
    

    // 全局注册组件PageTools
   Vue.component('PageTools',PageTools)  

   // 全局注册组件UploadExcel
   Vue.component('UploadExcel',UploadExcel) 
    
    //创建上传图片全局组件
   Vue.component('ImageUpload',ImageUpload)  


  }

}

export default plugins