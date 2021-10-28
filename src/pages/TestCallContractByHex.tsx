/**
 * 测试通过合约调用数据
 */

import { useActiveWeb3React } from '@/hooks/web3'

import React, { memo, useCallback, useEffect, useMemo } from 'react'

import { useMulticall2Contract, useSwapMiningContract } from '@/hooks/useContract'

function TestCallContractByHex() {
  const { account } = useActiveWeb3React()

  const swapMiningContract = useSwapMiningContract()

  // useEffect(() => {
  //   asyncFunc()

  //   // if (!swapMiningContract || !account) return

  //   // swapMiningContract.rewardInfo(account).then((res: any) => {
  //   //   console.debug('[res]:', res)
  //   // })

  //   // const swapMiningFragment = swapMiningContract.interface.getFunction('rewardInfo')

  //   // const callDataString = swapMiningContract.interface.encodeFunctionData(swapMiningFragment, [account])
  // }, [])

  // useEffect(() => {
  //   console.log('[contractMap]:', contractStore)

  //   if (!swapMiningContract) return

  //   contractStore.set('0xjskljflj2k3jkl2jlh2lkhglk2h3lkg', '456' as unknown as Contract)

  //   contractStore.set(swapMiningContract.address, swapMiningContract)

  //   console.log('[contractMap]:', contractStore)
  // }, [swapMiningContract])

  // useEffect(() => {
  //   const contract = contractStore.get<SwapMingContract>('0x01Af8d162E217eE0eF22f7ddb52488870335ca12')

  //   if (!contract || !account) return

  //   contract['rewardInfo'](account).then((res: any) => {
  //     console.log('[res](查询奖励):', res)
  //   })
  // }, [account])

  const swapMiningFragment = useMemo(() => {
    return swapMiningContract?.interface?.getFunction('rewardInfo')
  }, [swapMiningContract?.interface])

  // 测试用multicall2Contract查询数据
  const multicall2Contract = useMulticall2Contract()
  const asyncFunc2 = useCallback(async () => {
    if (!swapMiningContract || !multicall2Contract || !swapMiningFragment) return

    const callDataString = swapMiningContract.interface.encodeFunctionData(swapMiningFragment, [account])

    const { blockNumber, returnData } = await multicall2Contract.callStatic.tryBlockAndAggregate(true, [
      {
        target: swapMiningContract.address,
        callData: callDataString,
      },
    ])
    // debugger

    // const signHashFromData = hexlify('0x' + parseInt('rewardInfo', 16))

    // const data111 = '0x000000000000000000000000000000000000000000000000000020deef4e8796'

    // const bytes = arrayify(data111)
    // const hexedHead = hexlify(bytes.slice(0, 4))
    // const signHash = swapMiningContract.interface.getSighash(swapMiningFragment)

    returnData.forEach((data) => {
      try {
        const result = swapMiningContract.interface.decodeFunctionResult(swapMiningFragment, data.returnData)

        console.debug('[result](decodeFunctionData):', result)
      } catch (error) {
        console.debug('[err](decodeFunctionData出错):', error)
      }
    })
  }, [account, multicall2Contract, swapMiningContract, swapMiningFragment])
  useEffect(() => {
    asyncFunc2()
  }, [asyncFunc2])
  return <>TestCallContractByHex</>
}

export default memo(TestCallContractByHex)
