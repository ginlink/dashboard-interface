/*
 * @Author: jiangjin
 * @Date: 2021-09-01 10:32:22
 * @LastEditTime: 2021-09-13 13:11:28
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import resources from './locales/resources'
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'zh',
    lng: 'zh',
    debug: true,
    resources: resources,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

const changeLanguagehandler = (language: string) => {
  i18n.changeLanguage(language)
}
export default i18n
export { changeLanguagehandler }
