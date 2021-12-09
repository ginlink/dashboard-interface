export type BaseAbi = {
  inputs: {
    name: string
    type: string
  }[]
  name?: string
}

export type ParsedFuc = {
  params?: string[]
  name?: string
}

export function parseFunc(abi?: BaseAbi[]): ParsedFuc[] | undefined {
  if (!abi) return

  return abi.map((item) => {
    const { name, inputs } = item

    // const paramLen = inputs.length

    const params = inputs.map((param) => {
      const { type, name: paramName } = param

      return `${type} ${paramName}`
    })

    return {
      name,
      // params: paramLen ? params : undefined,
      params,
    }
  })
}
