// 数字转化

import { BigNumber } from 'ethers'
import BigFloatNumber from 'bignumber.js'

/**
 * 将BigNumber转化为BigFloatNumber
 * @param num
 * @returns
 */
export const bigNum2Float = (num: BigNumber | number | string) => {
  num = num == null ? 0 : num

  // TODO 测试BigNumber.toString()最大小数位数，不允许出现BigFloatNumber
  // 的科学计数法问题
  return new BigFloatNumber(num.toString())
}

/**
 *
 * 将单位从wei到eth【大数字转小数字】，并将BigNumber转为BigFloatNumber
 * @param bigNum
 * @param decimals 精度
 * @returns
 */
export const wei2eth = (
  bigNum: BigNumber | number | string | BigFloatNumber | undefined | null,
  decimals = 18
): BigFloatNumber | undefined => {
  if (!bigNum) return undefined

  if (bigNum instanceof BigFloatNumber) {
    return bigNum.div(Math.pow(10, decimals))
  }

  return bigNum2Float(bigNum).div(Math.pow(10, decimals))
}

/**
 * 将单位从eth到wei【小数字转大数字】，并将BigNumber转为BigFloatNumber
 * @param bigNum
 * @param decimals
 * @returns
 */
export const eth2wei = (bigNum: BigNumber | number | string | BigFloatNumber, decimals = 18) => {
  if (bigNum instanceof BigFloatNumber) {
    return bigNum.multipliedBy(Math.pow(10, decimals))
  }

  return bigNum2Float(bigNum).multipliedBy(Math.pow(10, decimals))
}

/**
 * 将输入值转化为十六进制，包含头部0x
 * @param num
 * @returns
 */
export const num2HexString = (num: BigFloatNumber | number | string | BigNumber) => {
  num = num == null ? 0 : num

  // 这里要强转number，因为number才有toString(radix)
  if (typeof num == 'string') num = Number(num)
  if (num instanceof BigFloatNumber || num instanceof BigNumber) num = Number(num.toString())

  return `0x${num.toString(16)}`
}

/**
 * 计算匹配次数
 * @param origin 原对象
 * @param target 要匹配对象
 * @returns 0不匹配  1匹配单币  2匹配双币
 */
export const computeMatchTimes = (origin: any, target: any): number => {
  const set = new Set()

  if (!target.token0 || !target.token1) {
    const singleToken = target.token0 || target.token1 // token不能为null

    singleToken && set.add(singleToken)
    origin.token0 && set.add(origin.token0)
    origin.token1 && set.add(origin.token1)
    if (set.size != 1) return 0

    // console.log('[匹配单币]:', singleToken)
    return 1
  } else {
    // token不能为null
    target.token0 && set.add(target.token0)
    target.token1 && set.add(target.token1)

    origin.token0 && set.add(origin.token0)
    origin.token1 && set.add(origin.token1)

    if (set.size != 2) return 0

    // console.log('[双币]:', set)
    return 2
  }
}
