import BigFloatNumber from 'bignumber.js'
import { BigNumber } from 'ethers'
import { computeNumUnit } from './formatNum'

describe('#computeNumUnit', () => {
  it('测试解析科学计数法', () => {
    console.log("[computeNumUnit('1e-9']:", computeNumUnit('1e-9'))

    expect(computeNumUnit('1e-30')).toEqual('0.00')
  })
  // it('边界条件测试', () => {
  //   // 边界条件测试
  //   expect(computeNumUnit(0)).toEqual('0.00')
  //   expect(computeNumUnit('0')).toEqual('0.00')

  //   // 如果不通过，则返回-
  //   expect(computeNumUnit(undefined)).toEqual('-')
  //   expect(computeNumUnit(null)).toEqual('-')

  //   // 如果存在其他字符，则直接返回-
  //   expect(computeNumUnit('99999999-999.000')).toEqual('-')
  //   expect(computeNumUnit('你好')).toEqual('-')
  //   expect(computeNumUnit('998f0000')).toEqual('-')
  //   expect(computeNumUnit('998O000')).toEqual('-') // 有一个大写字符O
  // })
  // it('大正整数测试', () => {
  //   // 大正整数测试
  //   expect(computeNumUnit('9999999')).toEqual('10.00M')

  //   expect(computeNumUnit('999999999999')).toEqual('1,000.00B')

  //   expect(computeNumUnit('999999999999999999')).toEqual('1,000,000.00T')

  //   expect(computeNumUnit('999999999999999999999999')).toEqual('1,000,000,000,000.00T')

  //   expect(computeNumUnit('999999999999999999999999999999')).toEqual('1,000,000,000,000,000,000.00T')
  // })
  // it('大正小数测试', () => {
  //   expect(computeNumUnit('999999.000')).toEqual('999,999.00')

  //   expect(computeNumUnit('999999.49000001')).toEqual('999,999.49')
  //   expect(computeNumUnit('999999.50000001')).toEqual('1.00M')
  //   // 结果为四舍五入，如果不要改用其他模式，请修改computeNumUnit，返回值.toFix()，
  //   // 传入第二个参数

  //   expect(computeNumUnit('99999999999.99999999999')).toEqual('100.00B')
  // })
  it('负数测试', () => {
    // 不处理负数情况，认为负数为-
    // expect(computeNumUnit(-0)).toEqual('0.00') // 认为-0 === 0

    // expect(computeNumUnit(-1)).toEqual('-')
    expect(computeNumUnit('-999999.50000001')).toEqual('-')
  })
  // it('保留小数测试', () => {
  //   // 保留小数测试
  //   expect(computeNumUnit('9999999', 3)).toEqual('10.000M')
  // })

  // it('测试用BigNumber', () => {
  //   const bigNum1 = BigNumber.from(0)
  //   const bigNum2 = BigNumber.from('0')
  //   const bigNum3 = BigNumber.from('-0')
  //   const bigNum4 = BigNumber.from('9999')
  //   const bigNum5 = BigNumber.from('9999999')
  //   // const bigNum6 = BigNumber.from('9999.40987483') // 数据异常，不允许
  //   // const bigNum7 = BigNumber.from('9999999.40987483')
  //   // const bigNum8 = BigNumber.from('-9999999.40987483')
  //   // const bigNum9 = BigNumber.from('-sjfkjs')

  //   expect(computeNumUnit(bigNum1)).toEqual('0.00')
  //   expect(computeNumUnit(bigNum2)).toEqual('0.00')
  //   expect(computeNumUnit(bigNum3)).toEqual('0.00')
  //   expect(computeNumUnit(bigNum4)).toEqual('9,999.00')
  //   expect(computeNumUnit(bigNum5)).toEqual('10.00M')
  //   // expect(computeNumUnit(bigNum6)).toEqual('999.41')
  //   // expect(computeNumUnit(bigNum7)).toEqual('10.41M')
  //   // expect(computeNumUnit(bigNum8)).toEqual('-')
  //   // expect(computeNumUnit(bigNum9)).toEqual('-')

  //   const bigNum10 = new BigFloatNumber(0)
  //   const bigNum11 = new BigFloatNumber('0')
  //   const bigNum12 = new BigFloatNumber('9999.40987483')
  //   const bigNum13 = new BigFloatNumber('9999999.40187483')
  //   const bigNum14 = new BigFloatNumber('-9999999.40987483')
  //   const bigNum15 = new BigFloatNumber('-sjfkjs')

  //   expect(computeNumUnit(bigNum10)).toEqual('0.00')
  //   expect(computeNumUnit(bigNum11)).toEqual('0.00')
  //   expect(computeNumUnit(bigNum12)).toEqual('9,999.41')
  //   expect(computeNumUnit(bigNum13)).toEqual('10.00M') // 9.99999940187483M
  //   expect(computeNumUnit(bigNum14)).toEqual('-')
  //   expect(computeNumUnit(bigNum15)).toEqual('-')
  // })
  // it('不允许出现NaN情况', () => {
  //   expect(computeNumUnit(NaN)).toEqual('-')

  //   expect(computeNumUnit(new BigFloatNumber('12jslkdjflakjkdljflk'))).toEqual('-')
  // })
})
