import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale'
import zh from './zh-ch'
import en from './en'
Vue.use(VueI18n)

const messages = {
  en: {
    ...en
  },
  zh: {
    ...zh
  }
}

const i18n = new VueI18n({
  locale: localStorage.lang || 'zh',
  messages
})
locale.i18n((key, value) => i18n.t(key, value))
export default i18n
