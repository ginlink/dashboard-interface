/*
 * @Author: jiangjin
 * @Date: 2021-10-08 10:13:27
 * @LastEditTime: 2021-10-09 10:38:50
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import { isMain } from 'constants/addresses'

export declare const FACTORY_ADDRESS = isMain
  ? '0x571521f8c16f3c4eD5f2490f19187bA7A5A3CBDf'
  : '0x1C7B0F3029B49D90B47a753ce2a4EE77899D8a63'
export declare const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export declare const POOL_INIT_CODE_HASH = '0x8648e6a9f0852d84a8a9787d749989a398cbb000270e4cd106f3dc2bc94e99ff'
/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export declare enum FeeAmount {
  LOW = 1000,
  MEDIUM = 2000,
  HIGH = 5000,
}
/**
 * The default factory tick spacings by fee amount.
 */
export declare const TICK_SPACINGS: {
  [amount in FeeAmount]: number
}
