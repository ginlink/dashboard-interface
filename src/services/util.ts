/**
 * 将对象解析为query形式
 * 例如：{a : 1}解析为?a=1 的形式
 * @param params
 * @returns
 */
export function parseParam(params: Record<string, any> | undefined): string {
  if (!params) return ''

  let param = ''

  const paramKeys = Object.keys(params)
  if (paramKeys.length > 0) {
    param += '?'

    paramKeys.forEach((key) => {
      const value = params[key]

      param += `${key}=${value}&`
    })

    param = param.slice(0, -1)
  }

  return param
}

// TEST
// const aaa0 = undefined
// const aaa = {}
// const aaa1 = { name: 'name' }
// const aaa2 = { name: 'name', age: 12 }

// console.log('[](aaa0):', parseParam(aaa0))
// console.log('[](aaa):', parseParam(aaa))
// console.log('[](aaa1):', parseParam(aaa1))
// console.log('[](aaa2):', parseParam(aaa2))
