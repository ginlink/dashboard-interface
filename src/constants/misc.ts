/*
 * @Author: your name
 * @Date: 2021-09-01 11:19:52
 * @LastEditTime: 2021-09-12 22:14:46
 * @LastEditors: jiangjin
 * @Description: In User Settings Edit
 * @FilePath: /undefined/Users/jiangjin/Documents/00.convert/converter-bsc-web/src/constants/misc.ts
 */

// 支持语言列表
export const supportLangList = [
  { id: 1, title: 'English', symbol: 'en-US' },
  { id: 4, title: '日本語', symbol: 'ja-JP' },
  { id: 5, title: '한국어', symbol: 'ko-KR' },
  { id: 6, title: 'Deutsch', symbol: 'de-DE' },
  { id: 8, title: 'Bahasa Indonesia', symbol: 'id-ID' },
  { id: 7, title: 'Tiếng Việt', symbol: 'vi-VN' },
  { id: 2, title: '简体中文', symbol: 'zh-CN' },
  { id: 3, title: '繁體中文', symbol: 'zh-TW' },
  // { id: 7, title: 'Pусский', symbol: 'ru-RU' },
]

// 用于创建web3React的网络名称，随意取
export const NetworkContextName = 'NETWORK'

// export const NetworkContextName = '4bf032f2d38a4ed6bb975b80d6340847'

// 在fetch chunk的时候，允许块最大容错数，给一个容错可以避免多次请求，且数据不会受影响
// 例如：现在读取到的数据块为3，而latestBlockNumber已经为4了，那么给一个容错，则不会重试拉取数据，但数据是准确的（因为做了依赖更新处理，只有数据变化的时候才会重新更新），节流用
// 详见src/store/multicall/updater.tsx:176
// TODO 暂未发现数据落后的情况，如果数据要求准确，则需要修改为0
export const MAX_ACCESS_SPACING = 2

export const DEFAULT_FORMAT_DATE = 'yyyy-MM-DD HH:ss:mm'

// 网络请求轮询间隔
export const HTTP_POLL_DELAY = 10000

// 网络轮询队列元素请求间隔
export const HTTP_QUEUEQUERY_DELAY = 500
