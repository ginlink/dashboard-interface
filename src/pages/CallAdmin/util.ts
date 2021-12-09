export enum FuncType {
  READ = 1,
  WRITE,
  UNKNOWN,
}

export type ParsedFunc = {
  name?: string
  param?: string
  type?: FuncType
  origin?: string
}

const REG_NAME = /(?<=function ).+(?= \(.*\))/
const REG_PARAM = /(?<=\().*?(?=\))/

export function parseFunc(origin: string): ParsedFunc {
  // function approve (address spender, uint256 num) external
  // function balanceOf (address account) external view returns(uint256)

  const matchName = origin.match(REG_NAME)?.[0]
  const matchParam = origin.match(REG_PARAM)?.[0]
  const matchType = origin.match(/view/)
  debugger

  if (!matchName) throw new Error('解析出错')

  return {
    name: matchName,
    param: matchParam,
    type: !!matchType ? FuncType.READ : FuncType.WRITE,
    origin,
  }
}
