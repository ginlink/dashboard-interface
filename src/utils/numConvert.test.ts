import { num2HexString, wei2eth } from './numConvert'
import BigFloatNumber from 'bignumber.js'
import { BigNumber } from 'ethers'

// 测试numConvert各种数据类型的返回值
const baseStr = '11111'
const baseNum = 11111

const numBigFloatNumber = new BigFloatNumber(baseStr)
const numBigNumber = BigNumber.from(baseStr)

describe('numConvert', () => {
  // it('test cases', () => {
  //   expect(num2HexString(baseStr)).toEqual('0x2b67')
  //   expect(num2HexString(baseNum)).toEqual('0x2b67')
  //   expect(num2HexString(numBigFloatNumber)).toEqual('0x2b67')
  //   expect(num2HexString(numBigNumber)).toEqual('0x2b67')
  // })

  it('wei2eth', () => {
    // expect(wei2eth(9999999999999).toString()).toEqual('0.000009999999999999')
    // expect(wei2eth(1000000000000).toString()).toEqual('')
  })
})

// describe('numConvert', () => {
//   it('test cases', () => {
//     expect(parseENSAddress('hello.eth')).toEqual({ ensName: 'hello.eth', ensPath: undefined })
//     expect(parseENSAddress('hello.eth/')).toEqual({ ensName: 'hello.eth', ensPath: '/' })
//     expect(parseENSAddress('hello.world.eth/')).toEqual({ ensName: 'hello.world.eth', ensPath: '/' })
//     expect(parseENSAddress('hello.world.eth/abcdef')).toEqual({ ensName: 'hello.world.eth', ensPath: '/abcdef' })
//     expect(parseENSAddress('abso.lutely')).toEqual(undefined)
//     expect(parseENSAddress('abso.lutely.eth')).toEqual({ ensName: 'abso.lutely.eth', ensPath: undefined })
//     expect(parseENSAddress('eth')).toEqual(undefined)
//     expect(parseENSAddress('eth/hello-world')).toEqual(undefined)
//     expect(parseENSAddress('hello-world.eth')).toEqual({ ensName: 'hello-world.eth', ensPath: undefined })
//     expect(parseENSAddress('-prefix-dash.eth')).toEqual(undefined)
//     expect(parseENSAddress('suffix-dash-.eth')).toEqual(undefined)
//     expect(parseENSAddress('it.eth')).toEqual({ ensName: 'it.eth', ensPath: undefined })
//     expect(parseENSAddress('only-single--dash.eth')).toEqual(undefined)
//   })
// })
