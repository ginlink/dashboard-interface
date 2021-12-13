import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import { useActiveWeb3React } from './web3'
import { Web3Provider } from '@ethersproject/providers'
import { isAddress } from '@/utils'

import ERC20_BYTES32_ABI from '@/abis/erc20_bytes32.json'
import ERC20_ABI from '@/abis/erc20.json'
import REWARD_POOL_ABI from '@/abis/reward-pool.json'

import { Erc20, ISpePool, RewardPool, SafeFactory, SwapMining } from '@/abis/types'
import abiDatas from '../abis/ISpePool.json'
import {
  TRANSACTION_PROXY_ADDRESS,
  TRANSACTION_POSITION_REWARD_ADDRESS,
  TRANSACTION_SWAPMING_ADDRESSES,
  TRANSACTION_OPERATABLE_ADDRESS,
  TRANSACTION_MULTISEND_ADDRESS,
  SAFE_FACTORY_ADDRESS,
  MULTICALL_ADDRESSES,
  AddressMap,
} from '@/constants/addresses'
import { abi as gnosisSafe } from '@/abis/GnosisSafe.json'
import { abi as Ownable } from 'abis/Ownable.json'
import { abi as multiSend } from 'abis/MultiSend.json'
import { abi as positionReward } from 'abis/position-reward.json'
import { abi as SAFE_FACTORY_ABI } from 'abis/safe_factory.json'
import { abi as SWAP_MING_ABI } from 'abis/swap-mining.json'
import { GnosisSafe } from 'abis/types/GnosisSafe'
import { PositionReward } from 'abis/types/PositionReward'
import { MultiSend } from 'abis/types/MultiSend'

import { UniswapInterfaceMulticall } from '@/types/v3'
import { abi as MULTICALL_ABI } from 'plugins/@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json'

export function getSigner(library: Web3Provider, account: string) {
  return library.getSigner(account).connectUnchecked()
}

export function getSignerOrProvider(library: Web3Provider, account?: string | null) {
  return account ? getSigner(library, account) : library
}

export const AddressZero = '0x0000000000000000000000000000000000000000'

export function useContract<T extends Contract = Contract>(
  _address: AddressMap | string | undefined,
  ABI: any[],
  withSigner = true
): T | undefined {
  const { library, account, chainId } = useActiveWeb3React()

  const address = useMemo(() => {
    if (!chainId) return
    return typeof _address == 'string' ? _address : _address ? _address[chainId] : undefined
  }, [_address, chainId])

  return useMemo(() => {
    if (!library || !account || !address) return

    if (!isAddress(address) || address === AddressZero) {
      throw Error(`Invalid 'address' parameter '${address}'.`)
    }

    // 默认所有合同带有签名
    const contract = new Contract(address, ABI, getSignerOrProvider(library, withSigner ? account : undefined))

    return contract
  }, [ABI, account, address, library, withSigner]) as T
  // 强制声明为T
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | undefined {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useMulticallContract() {
  return useContract<UniswapInterfaceMulticall>(MULTICALL_ADDRESSES, MULTICALL_ABI, false)
}

export function useTokenContract(tokenAddress?: string) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI)
}

export function useRewardPoolContract(poolAddress: string | undefined, withSigner?: boolean) {
  return useContract<RewardPool>(poolAddress, REWARD_POOL_ABI, withSigner)
}

export function usePositionContract(address: any) {
  return useContract<ISpePool>(address, abiDatas)
}

// TODO  transaction contract start

export function useTransactionOwnable() {
  return useContract(TRANSACTION_OPERATABLE_ADDRESS, Ownable)
}

export function useTransactionProxy() {
  return useContract<GnosisSafe>(TRANSACTION_PROXY_ADDRESS, gnosisSafe)
}

export function useTransactionReward() {
  return useContract<PositionReward>(TRANSACTION_POSITION_REWARD_ADDRESS, positionReward)
}

export function useTransactionMultiSend() {
  return useContract<MultiSend>(TRANSACTION_MULTISEND_ADDRESS, multiSend)
}

export function useTransactionSafeFactory() {
  return useContract<SafeFactory>(SAFE_FACTORY_ADDRESS, SAFE_FACTORY_ABI)
}

export function useTransactionSwapMing() {
  return useContract<SwapMining>(TRANSACTION_SWAPMING_ADDRESSES, SWAP_MING_ABI)
}
