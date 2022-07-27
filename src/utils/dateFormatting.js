import * as dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // import locale
dayjs.locale('zh-cn') // use locale

// 年月日
export const yearMonthDay = (option) => {
  return dayjs(option).format('YYYY-MM-DD')
}
