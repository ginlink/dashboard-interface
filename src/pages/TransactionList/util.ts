import { FuncType, ParsedFunc } from '../CallAdmin/util'

export type StaticBaseAbi = {
  inputs?: {
    name?: string
    type?: string
  }[]
  name?: string
  type?: string
  stateMutability?: 'view' | 'other'

  [key: string]: any
}

export function parseFuncs(abi?: StaticBaseAbi[]): ParsedFunc[] | undefined {
  if (!abi) return

  const realAbi = abi.filter((item) => item.type === 'function')

  return realAbi.map((item) => {
    const { name, inputs, stateMutability } = item

    // const paramLen = inputs.length

    const param = inputs
      ?.map((param) => {
        const { type, name: paramName } = param

        return `${type} ${paramName}`
      })
      ?.join(',')

    const isView = stateMutability && stateMutability === 'view'

    return {
      name,
      // params: paramLen ? params : undefined,
      param,
      nameAndParam: `${name}(${param})`,

      type: isView ? FuncType.READ : FuncType.WRITE,
    }
  })
}

export type StaticBaseContract = {
  contractName?: string
  abi?: StaticBaseAbi[]
}

/**
 *
 * {
 *  ['swapContract']: {
 *    funcs: [
 *      {
 *        name: 'balanceOf',
 *        param: 'address account, address xxx',
 *        origin: '',
 *      }
 *    ]
 *  }
 * }
 */

// export function parseFunc2(abis: StaticBaseAbi[] | undefined): ParsedFuc[] | undefined {
//   if (!abis) return
// }

export type ParsedContract = {
  [key: string]: {
    funcs?: ParsedFunc[]
    abi: any
  }
}

export type ContractAddresses = {
  [key: string]: string
}

export function parseAbis(staticContract?: StaticBaseContract[]): ParsedContract | undefined {
  if (!staticContract) return

  return staticContract.reduce<ParsedContract>((memo, item): ParsedContract => {
    const { contractName, abi } = item

    if (!contractName) return memo

    memo[contractName] = {
      funcs: parseFuncs(abi),
      abi: abi,
    }

    return memo
  }, {})

  // return staticContract.reduce((memo, item) => {
  //   const { contractName, abi } = item

  //   memo[contractName] = {
  //     funcs:
  //   }

  //   // if (!contractName) return

  // }, {})
}
