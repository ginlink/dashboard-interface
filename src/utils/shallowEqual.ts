/*
 * @Author: jiangjin
 * @Date: 2021-09-12 11:58:48
 * @LastEditTime: 2021-09-12 14:27:57
 * @LastEditors: jiangjin
 * @Description:
 *  用于useSelector比较函数
 */
import { shallowEqual } from 'react-redux'

/**
 * 比较两个数组中对象是否改变，对象深度只为1
 * @param left
 * @param right
 * @returns
 */
export function shallowEqualArr<T>(left: T[] | undefined, right: T[] | undefined): boolean {
  if (!left || !right) return false
  if (left.length != right.length) return false

  for (let i = 0; i < left.length; ++i) {
    if (!shallowEqual(left[i], right[i])) return false
  }

  return true
}

/**
 * 深层比较对象，耗时分析详见测试文件
 * @param left
 * @param right
 * @param depth 深度，默认无限深度，在指定深度内如果相等 则相等
 * @returns
 */
export function deepEqual(
  left: Record<any, any> | undefined | null,
  right: Record<any, any> | undefined | null,
  depth = 0
): boolean {
  let currentDepth = 0
  let res = true

  function rec(left: Record<any, any> | undefined | null, right: Record<any, any> | undefined | null, depth = 0) {
    currentDepth++
    if (depth != 0 && currentDepth > depth) return res

    // console.log('[进来次数]:', currentDepth, depth)
    // 避免两个为undfined, null, ''等
    if (left === right) return (res = true)

    if (!left || !right) return (res = false)

    // 遍历对象
    const keys1 = Object.keys(left)
    const keys2 = Object.keys(right)
    const len1 = keys1.length
    const len2 = keys2.length

    const shallowRes = shallowEqual(left, right)
    if (shallowRes) return (res = true)
    // 如果自带的都为true，那么一定为true，所以直接返回

    if (len1 === 0 && len2 === 0) return (res = true)
    if (len1 !== len2) return (res = false) // 两者数量不同，直接返回

    for (let i = 0; i < len1; ++i) {
      const key = keys1[i]

      const value1 = left[key]
      const value2 = right[key]

      // 判断两个key是否相同
      if (!value1 || !value2) return (res = false)

      // TODO 已完成比较
      // 1.基本类型
      // 2.数组
      // 3.对象

      // 目前已知不能处理
      // 1.function，一般状态管理器不会存非序列化数据

      // 基本数据类型
      if (typeof value1 !== 'object') {
        res = value1 === value2
      }

      // 判断数组类型
      if (value1 instanceof Array) {
        res = shallowEqualArr(value1, value2)
      }

      // 判断对象
      if (isType(value1, 'object')) {
        // console.log('[]:', value1, value2, res)
        if (!rec(value1, value2, depth)) return (res = false)

        // console.log('[]:', left, right, res)

        // 不返回也不跳过，进入下一个判断区
        res = true
      }
    }

    return res
  }

  rec(left, right, depth)

  return res
}

export function isType(value: any, target: string): boolean {
  if (value === undefined) return 'undefined' == target

  return Object.prototype.toString.apply(value).split(' ')[1].slice(0, -1).toLowerCase() == target
}
