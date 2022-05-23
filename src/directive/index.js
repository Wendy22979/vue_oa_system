

// 解决图片如果地址出错，加载不出，设置默认图片
export const imgerror = {
  // 挂载到页面时触发
  inserted(element,binding){
    // 加载出错时被触发
    element.onerror = function(){
      element.src= binding.value
    }
  }
}