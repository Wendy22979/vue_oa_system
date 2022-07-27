// excel导出

export function excelDerive(headers, title, data) { // headers表头转换的数组   title表名 data二维数组数据
  // 按需加载调用导出插件
  import('@/vendor/Export2Excel').then(async(excel) => {
    // 数据传入插件准备导出
    excel.export_json_to_excel({
      header: headers, // 表头数组
      data, // 二维数组结构，必传，为导出的数据列表
      filename: title, // 文件标题
      autoWidth: true, // 列表宽度是否自适应
      bookType: 'xlsx' // 生成文件类型后缀
    })
  })
}

