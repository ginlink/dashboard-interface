/*
 * @Author: jiangjin
 * @Date: 2021-09-04 16:23:08
 * @LastEditTime: 2021-09-12 22:49:25
 * @LastEditors: jiangjin
 * @Description:
 *  styled-components的vw适配预先处理函数，通过正则替换的方式进行预处理
 *  目前此方法有bug，已弃用
 *
 */

/**
 * 使用方法：
 * 在原有的基础上加上(t)即可，所以可以用以下方法批量更改 `tips：建议先用一个试一下，成功后再批量替换`

- 批量替换正则
  (?<=styled.+?)(?<!t)(`[\s\S\r]+?`)
  替换为
  (t$1)

- 还原的正则
  (?<=styled.+?)\(t(`[\s\S\r]+?`)\)
  替换为
  $1

> 注意：**请打开vscode的正则搜索模式**
 */

import { css, DefaultTheme, FlattenInterpolation, Interpolation, ThemedStyledProps } from 'styled-components/macro'
enum ADAPTION_MODE_VALUE {
  all = 0, // 转化所有px为vw
  media = 1, // 只转化媒体查询的px为vw
  out = 2, // TODO 未实现，只转化除媒体查询外的px为vw
}

// 一些配置
// eslint-disable-next-line prefer-const
let ADAPTION_MODE = ADAPTION_MODE_VALUE.media // 转化模式
// let ADAPTION_MODE = ADAPTION_MODE_VALUE.all // 转化模式

const DESIGNED_MEASURE = 375 // 设计稿尺寸
const MIN_PX = 1 // 最小转化值，例如：小于等于1px则不处理

// 一些正则
const PX_REG = /(\d+)px(?!\))/
// const MEDIA_REG = /{[^}]+\}/
const MEDIA_REG = /@media([\s\S\r]+)\{[\s\S\r]+\}/
const NO_MEAN = 'NO_MEAN' // 1px占位符

// 耗时分析
const TIME_SPEED_SYMBOL = '[移动端适配转化函数](转化时间)'

// 转化核心函数
function px2vw(pixels: string | number | TemplateStringsArray) {
  if (pixels instanceof Array) {
    // 从模板中拿去值
    pixels = pixels[0]
  }

  const num = parseInt(pixels as string)
  if (num <= MIN_PX) return `${num}${NO_MEAN}` // nomean占位，否则死循环

  return `${((num / DESIGNED_MEASURE) * 100).toFixed(3)}vw`
  // 结果保留三位小数
}
/**
 *  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    margin-bottom: 83px;
  }
  @media (max-width: ###960px###) {
    img {
      width: 55px;
      height: 18px;
      margin-bottom: 30px;
    }
  }
 */

// 转化所有
function allPx2vw(stylesStr: string) {
  let res: string = stylesStr

  const pxMatchReg = new RegExp(PX_REG)

  while (pxMatchReg.test(res)) {
    const pxMatchResult = pxMatchReg?.exec(res)
    if (!pxMatchResult) continue

    res = res?.replace(PX_REG, `${px2vw(pxMatchResult[1])}`)
  }

  // 把占位符替换回来
  res = res?.replace(/NO_MEAN/g, 'px')

  return res
}

// 只转化媒体查询
function onlyMediaPx2vw(stylesStr: string) {
  const mediaReg = new RegExp(MEDIA_REG)
  while (mediaReg.test(stylesStr)) {
    let mediaRegResult = mediaReg?.exec(stylesStr)?.[0]
    if (!mediaRegResult) continue

    const pxMatchReg = new RegExp(PX_REG)

    while (pxMatchReg.test(mediaRegResult)) {
      const pxMatchResult = pxMatchReg?.exec(mediaRegResult)
      if (!pxMatchResult) continue

      mediaRegResult = mediaRegResult?.replace(PX_REG, `${px2vw(pxMatchResult[1])}`)
    }

    let replacedRegRes = mediaRegResult

    // 将{}替换为占位符，否则会死循环
    replacedRegRes = replacedRegRes?.replaceAll('{', '^^^')
    replacedRegRes = replacedRegRes?.replaceAll('}', '---')

    // console.log('[replacedRegRes]:', replacedRegRes)

    if (!replacedRegRes) continue

    stylesStr = stylesStr?.replace(MEDIA_REG, replacedRegRes)
  }

  // 将占位符替换回来
  stylesStr = stylesStr?.replaceAll('^^^', '{')
  stylesStr = stylesStr?.replaceAll('---', '}')
  stylesStr = stylesStr?.replace(/NO_MEAN/g, 'px')

  return stylesStr
}

// TODO 只转化除媒体查询外的px为vw

// 将styles转化为string，主要为了给函数打一个标记
function stringStyles(origin: FlattenInterpolation<ThemedStyledProps<Record<string, never>, DefaultTheme>>) {
  let res = ''
  const len = origin.length

  for (let i = 0; i < len; ++i) {
    const item = origin[i]

    if (typeof item !== 'string') {
      if (i == len - 1) {
        res = res + i
      } else {
        res = res + i + '###'
      }
      continue
    }

    if (i == len - 1) {
      res = res + item
    } else {
      res = res + item + '###'
    }
  }

  return res
}

// 将string转化为styles，主要为了将函数还原
function resetStyles(
  origin: string,
  styles: FlattenInterpolation<ThemedStyledProps<Record<string, never>, DefaultTheme>>
): any[] {
  const res = origin.split('###')
  const resetedStyles: any[] = []

  res.forEach((item) => {
    if (!isNaN(Number(item))) {
      // 是函数
      return resetedStyles.push(styles[Number(item)])
    }

    resetedStyles.push(item)
  })

  return resetedStyles
}

// 媒体查询预处理
function mediaPreHandler(str: string) {
  // 将媒体查询的max-width区别出来，不要转化
  const firstPxReg = /(?<=@media[\s\S\r]*?)px(?=.*\))/g
  // console.log('[nounit]:', str?.replaceAll(firstPxReg, 'nounit'))

  console.debug('str', str, typeof str)
  return str?.replaceAll(firstPxReg, 'nounit')
}

function mediaAftHandler(str: string) {
  // console.log('[resetNounit]:', str?.replaceAll('nounit', 'px'))
  return str?.replaceAll('nounit', 'px')
}

function convert(styles: FlattenInterpolation<ThemedStyledProps<Record<string, never>, DefaultTheme>>) {
  let stringedStyles = stringStyles(styles)
  // debugger

  // let stringedStyles = stringStyles([
  //   '\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  img {\n    margin-bottom: 83px;\n  }\n  @media (max-width: ',
  //   '960px',
  //   ') {\n    img {\n      width: 55px;\n      height: 18px;\n      margin-bottom: 30px;\n    }\n  }\n',

  //   '@media (max-width: 768px) {\n    img {\n      width: 55px;\n      height: 18px;\n      margin-bottom: 30px;\n    }\n  }\n',
  // ])
  // console.debug('[stringedStyles,]:', styles, stringedStyles)

  switch (ADAPTION_MODE) {
    case ADAPTION_MODE_VALUE.all:
      stringedStyles = allPx2vw(stringedStyles)
      break

    case ADAPTION_MODE_VALUE.media:
      stringedStyles = mediaPreHandler(stringedStyles)

      stringedStyles = onlyMediaPx2vw(stringedStyles)

      stringedStyles = mediaAftHandler(stringedStyles)

      break
  }

  const resetedStyles = resetStyles(stringedStyles, styles)
  // console.debug('[resetedStyles,]:', resetedStyles)
  const tmpArr: Record<any, any> = [resetedStyles]
  tmpArr['raw'] = ['']

  console.timeEnd(TIME_SPEED_SYMBOL) // 耗时分析
  return tmpArr
}

export const t = (
  strings: TemplateStringsArray,
  ...interpolations: Array<Interpolation<ThemedStyledProps<Record<string, never>, DefaultTheme>>>
) => {
  console.time(TIME_SPEED_SYMBOL)

  const styles = css(strings, ...interpolations) // css是styled-components的一个helper

  return convert(styles)
}

// function convert222(styles: FlattenSimpleInterpolation) {
//   let stringedStyles = stringStyles(styles)
//   console.debug('[stringedStyles,]:', styles, stringedStyles)

//   switch (ADAPTION_MODE) {
//     case ADAPTION_MODE_VALUE.all:
//       stringedStyles = allPx2vw(stringedStyles)
//       break

//     case ADAPTION_MODE_VALUE.media:
//       stringedStyles = onlyMediaPx2vw(stringedStyles)
//       break
//   }

//   const resetedStyles = resetStyles(stringedStyles, styles)
//   console.debug('[resetedStyles,]:', resetedStyles)
//   const tmpArr: Record<any, any> = [resetedStyles]
//   tmpArr['raw'] = ['']

//   console.timeEnd(TIME_SPEED_SYMBOL) // 耗时分析

//   return resetedStyles
// }
// export function t2<T>(themedStyledFunction: T): T {
//   console.log('[themedStyledFunction]:', themedStyledFunction)

//   const tmp = themedStyledFunction as any
//   const componentStyle = tmp?.componentStyle
//   const styles: any[] | undefined = componentStyle?.rules

//   if (!componentStyle || !styles) return themedStyledFunction

//   const convertedStyles = convert222(styles).slice(0, 2)

//   const res = { ...tmp, componentStyle: { ...componentStyle, rules: convertedStyles } }

//   console.log('[res]:', res)
//   return res
// }
// interface t2Func {
//   <T>(component: ThemedStyledFunction<C, T>;): boolean;
// }

// let t2: t2Func;

// t2 = (themedStyledFunction: ) {

//   themedStyledFunction.componentStyle
// }

// export t2
