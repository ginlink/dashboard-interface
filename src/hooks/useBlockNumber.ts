import { RootState } from '@/store/state'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { usePositionContract } from './useContract'
import { useActiveWeb3React } from './web3'

export function useBlockNumber() {
  // TODO 将blockNumber的更新放入轮询中
  const { chainId } = useActiveWeb3React()

  return useSelector((state: RootState) => state.application.blockNumber[chainId ?? -1])
}

export async function usePoolAddressArr(item: any) {
  console.log('itme', item)

  // usePositionContract(item.addr)
  //   ?.token0()
  //   .then((res: any) => {
  //     console.log('res:', res)
  //     item.token0 = res
  //   })
  return item
}
