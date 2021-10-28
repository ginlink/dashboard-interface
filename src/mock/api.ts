/*
 * @Author: jiangjin
 * @Date: 2021-09-26 10:51:46
 * @LastEditTime: 2021-09-27 15:48:08
 * @LastEditors: jiangjin
 * @Description:
 *
 */

// 单币挖矿mock数据
export const singleData = [
  // busd
  {
    id: 1,
    token0: '0x110887Fc420292dCe51C08504ceE377872D0Db66',
    token1: '',
    lp_pool: '',

    platform: 'mdex',
    apr: '24.81',
    total_tvl: '9999999',

    vault_address: '0xc78e39179dAc44F2e7Cf62269C33D28D4404f968',
    reward_pool: '0x71aD1AC167d00117882898e6ff0f6296642394E1',
  },
]

// 流动性挖矿mock数据
export const farmData = [
  // busd-spc
  {
    id: 1,
    token0: '0x110887Fc420292dCe51C08504ceE377872D0Db66',
    token1: '0x5032d4f51A4D0278504BBdcaCB24f61CAd384DC8',
    lp_pool: '0x03a6eA3A48bb3AFeB6D2603EDFb8b8b170Fa82c2',

    platform: 'mdex',
    apr: '24.81',
    total_tvl: '9999999',

    vault_address: '0x40dE70A3957329e420F36b1E7E0788Ff42fdF79f',
    reward_pool: '0x59c40E9D6e26Ee98295270Bd5A05DAE2e976Ac27',
  },
  // spc-btc
  {
    id: 2,
    token0: '0x5032d4f51A4D0278504BBdcaCB24f61CAd384DC8',
    token1: '0x8ED5A0e0D77a854252A3de2A7fB6A1cBA157dD14',
    lp_pool: '0x52dc9f3B84e5083bcD6b35f5f0efdacEA8240a7c',

    platform: 'mdex',
    apr: '24.81',
    total_tvl: '9999999',

    vault_address: '0x0bfC0a13dbb034c178Bb4b2423fA7d0E0a2587CF',
    reward_pool: '0xB0e019602775B2DceB8Efb2dBEf1a281712E73b9',
  },
]

// 聚合流动性
export const setData = [
  // BUSD_USDC
  {
    id: 1,
    token0: '0x110887Fc420292dCe51C08504ceE377872D0Db66',
    token1: '0xfcD7f3d0F6Ab95F97DFfCa1e3EbC173FC675f6ed',
    lp_pool: '',

    platform: 'sheepDEX',
    apr: '24.81',
    total_tvl: '9999999',

    vault_address: '0x40dE70A3957329e420F36b1E7E0788Ff42fdF79f',
    reward_pool: '0x59c40E9D6e26Ee98295270Bd5A05DAE2e976Ac27',

    lower_tick: '1400',
    higher_tick: '2400',
  },
]
