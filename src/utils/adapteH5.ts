export function px2vwm(pixels: string | number | TemplateStringsArray | undefined, pixelTotal = 375) {
  // 设计图纸375
  if (pixels instanceof Array) {
    // 从模板中拿去值
    pixels = pixels[0]
  }

  const num = parseInt(pixels as string)
  return `${((num / pixelTotal) * 100).toFixed(5)}vw`
  // 结果保留五位小数
}

export function r(pixels: string | number | TemplateStringsArray | undefined, pixelTotal = 1920) {
  if (pixels instanceof Array) {
    pixels = pixels[0]
  }

  const num = parseInt(pixels as string)
  return `${((num / pixelTotal) * 100).toFixed(5)}vw`
  // 结果保留五位小数
}

export const MEDIUM = '960px'
// export const MEDIUM = '500px'
