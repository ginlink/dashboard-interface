import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import { useActiveWeb3React } from './web3'
import { Web3Provider } from '@ethersproject/providers'
import { isAddress } from '@/utils'

import ERC20_BYTES32_ABI from '@/abis/erc20_bytes32.json'
import MDX_VAULT_ABI from '@/abis/vault.json'
import swapMining from '@/abis/swap-mining.json'
import ERC20_ABI from '@/abis/erc20.json'
import REWARD_POOL_ABI from '@/abis/reward-pool.json'

import { Erc20, ISpePool, RewardPool, SafeFactory, SwapMining } from '@/abis/types'
import { SupportedChainId } from '@/constants/chains'
import { Vault } from '@/abis/types/Vault'
import abiDatas from '../abis/ISpePool.json'
import {
  TRANSACTION_PROXY_ADDRESS,
  TRANSACTION_POSITION_REWARD_ADDRESS,
  TRANSACTION_SWAPMING_ADDRESSES,
  TRANSACTION_OPERATABLE_ADDRESS,
  TRANSACTION_MULTISEND_ADDRESS,
  SAFE_FACTORY_ADDRESS,
} from '@/constants/addresses'
import { abi as gnosisSafe } from '@/abis/GnosisSafe.json'
import { abi as Ownable } from 'abis/Ownable.json'
import { abi as multiSend } from 'abis/MultiSend.json'
import { abi as positionReward } from 'abis/position-reward.json'
import { abi as SAFE_FACTORY_ABI } from 'abis/safe_factory.json'
import { abi as SIMPLE_STATE_ABI } from 'abis/simple_state.json'
import { abi as SWAP_MING_ABI } from 'abis/swap-mining.json'
import { GnosisSafe } from 'abis/types/GnosisSafe'
import { PositionReward } from 'abis/types/PositionReward'
import { MultiSend } from 'abis/types/MultiSend'

import { UniswapInterfaceMulticall } from '@/types/v3'
import { abi as MULTICALL_ABI } from 'plugins/@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json'
import { SimpleState } from '@/abis/types/SimpleState'

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

interface AddressMap {
  [chianId: number]: string
}

/********************** Address ************************** */
// 地址分为两种：主网、测试网地址

export const MDX_VAULT_ADDRESS: AddressMap | string = {
  [SupportedChainId.BSCTEST]: '0xc78e39179dAc44F2e7Cf62269C33D28D4404f968',
  [SupportedChainId.BSC]: '0xc78e39179dAc44F2e7Cf62269C33D28D4404f968',
}

export const SWAP_MINING_ADDRESSES: AddressMap | string = {
  [SupportedChainId.BSCTEST]: '0x01Af8d162E217eE0eF22f7ddb52488870335ca12',
  [SupportedChainId.BSC]: '0x01Af8d162E217eE0eF22f7ddb52488870335ca12',
}

export const MULTICALL_ADDRESSES: AddressMap | string = {
  // [SupportedChainId.BSCTEST]: '0xC4eB70E1C4C1d866fb4f1Be73AA458dCDe9a1F99',
  [SupportedChainId.BSCTEST]: '0x11cee792b8D394f90127C1d631842a4898A422a0',
  [SupportedChainId.BSC]: '0x193869c927F2e416E71c3D178266cD2faf7ca2d0',
}

export const ERCVAULT_ADDRESS: AddressMap | string = {
  [SupportedChainId.BSCTEST]: '0xc78e39179dAc44F2e7Cf62269C33D28D4404f968',
  [SupportedChainId.BSC]: '0xc78e39179dAc44F2e7Cf62269C33D28D4404f968',
}
export const MDX_REWARD_POOL: AddressMap | string = {
  [SupportedChainId.BSCTEST]: '0x71aD1AC167d00117882898e6ff0f6296642394E1',
  [SupportedChainId.BSC]: '0x71aD1AC167d00117882898e6ff0f6296642394E1',
}

export function getAddress(address: string | AddressMap, chainId: number | undefined) {
  if (!chainId) return

  return typeof address == 'string' ? address : address ? address[chainId] : undefined
}

/********************** Address End ************************ */

/********************** Contract ************************ */
// 一些合约

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | undefined {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

// 辅助合约，用于静态查询（轮询）数据
export function useMulticallContract() {
  return useContract<UniswapInterfaceMulticall>(MULTICALL_ADDRESSES, MULTICALL_ABI, false)
}

// 金库合约
export function useVaultContract(vaultAddress: string | undefined, withSigner?: boolean) {
  return useContract<Vault>(vaultAddress, MDX_VAULT_ABI, withSigner)
}

// 币合约，用于查询余额
export function useTokenContract(tokenAddress?: string) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI)
}

// 奖励池合约，用于质押和查询奖励
export function useRewardPoolContract(poolAddress: string | undefined, withSigner?: boolean) {
  return useContract<RewardPool>(poolAddress, REWARD_POOL_ABI, withSigner)
}

export function usePositionContract(address: any) {
  return useContract<ISpePool>(address, abiDatas)
}

export function useOwnable() {
  return useContract(TRANSACTION_OPERATABLE_ADDRESS, Ownable)
}

// TODO  transaction contract start

export function useTransactionProxy() {
  return useContract<GnosisSafe>(TRANSACTION_PROXY_ADDRESS, gnosisSafe)
}

export function useTransactionReward() {
  return useContract<PositionReward>(TRANSACTION_POSITION_REWARD_ADDRESS, positionReward)
}

export function useTransactionMultiSend() {
  return useContract<MultiSend>(TRANSACTION_MULTISEND_ADDRESS, multiSend)
}

export function useSafeFactory() {
  return useContract<SafeFactory>(SAFE_FACTORY_ADDRESS, SAFE_FACTORY_ABI)
}

export function useSafeProxy() {
  return useContract<GnosisSafe>('0x9894d1C28d474BeA3Ef95D6badFC160373df8a8A', gnosisSafe)
}

export function useSimpleState() {
  return useContract<SimpleState>('0x8c0e71928F3f099C0E0d94e31cf17f30D605bfD3', SIMPLE_STATE_ABI)
}

export function useSwapMing() {
  return useContract<SwapMining>('0x01Af8d162E217eE0eF22f7ddb52488870335ca12', SWAP_MING_ABI)
}
