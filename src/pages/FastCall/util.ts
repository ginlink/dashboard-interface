import { getSignerOrProvider } from '@/hooks/useContract'
import { Web3Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { ParsedFunc } from '../CallAdmin/util'

export type ContractFunction = {
  name?: string
  contract?: Contract
  param?: string
}

const DEFAULT_KEYS = [
  'interface',
  'provider',
  'signer',
  'callStatic',
  'estimateGas',
  'functions',
  'populateTransaction',
  'filters',
  '_runningEvents',
  '_wrappedEmits',
  'address',
  'resolvedAddress',
]

function createDefaultKeys() {
  const defaultKeys = new Set()
  for (let i = 0; i < DEFAULT_KEYS.length; ++i) {
    defaultKeys.add(DEFAULT_KEYS[i])
  }

  return defaultKeys
}

export function parseContract(contract: Contract) {
  const excludeKeys = createDefaultKeys()

  const funcs: ContractFunction[] = []

  for (const key in contract) {
    if (excludeKeys.has(key)) continue

    const matched = key.match(/^.+(?=\(.*\))/)
    if (!matched) continue

    const name = matched?.[0]

    console.log('[](key):', key, matched)

    const pos = key.indexOf('(')
    const param = key.slice(pos)

    const func: ContractFunction = {
      name,
      contract,
      param: param == '()' ? undefined : param.slice(1, -1),
    }

    funcs.push(func)
  }

  console.log('[](funcs):', funcs)

  return funcs
}

export type CreateContractProps = {
  funcs: ParsedFunc[]
  library: Web3Provider | undefined
  account: string | null | undefined
  address: string | undefined
}

export function createContract({ library, account, address, funcs }: CreateContractProps) {
  if (!library || !account || !address) return

  const abi = funcs.map((item) => {
    return item.origin || ''
  })

  return new Contract(address, abi, getSignerOrProvider(library, account))
}
