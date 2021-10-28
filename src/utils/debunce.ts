/*
 * @Author: jiangjin
 * @Date: 2021-09-01 14:51:59
 * @LastEditTime: 2021-09-02 10:32:37
 * @LastEditors: jiangjin
 * @Description:
 *
 */
export function debunce(fn: any, wait: number, immediate = true) {
  let timer: any | null, context: any, params: any

  return function (this: any, ...args: any) {
    if (!timer) {
      timer = later()

      if (!immediate) {
        context = this
        params = args
      } else {
        fn.apply(this, args)
      }
    } else {
      // 重复调用，清除定时器，
      clearTimeout(timer)
      timer = later()
    }
  }

  function later() {
    return setTimeout(() => {
      timer = null

      if (!immediate) {
        fn.apply(context, params)
        context = params = null
      }
    }, wait)
  }
}
