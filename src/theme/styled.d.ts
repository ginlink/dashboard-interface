import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color

  // text
  text0: Color
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color
  text6: Color
  text7: Color
  text8: Color
  text9: Color
  text10: Color
  text11: Color

  // backgrounds / greys
  bg0: Color
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  bg6: Color
  bg7: Color
  bg8: Color
  bg9: Color
  bg10: Color
  bg11: Color
  bg12: Color
  bg13: Color

  modalBG: Color
  advancedBG: Color

  // box shadow
  bs0: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color
  primary6: Color

  primaryText1: Color
  primaryText2: Color
  primaryText3: Color
  primaryText4: Color
  primaryText5: Color
  primaryText6: Color

  // pinks
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // other
  red1: Color
  red2: Color
  red3: Color
  green1: Color
  yellow1: Color
  yellow2: Color
  yellow3: Color
  blue1: Color
  blue2: Color

  error: Color
  success: Color
  warning: Color

  borderColor: Color
  borderColor2: Color
  borderColor3: Color

  boxShadow1: Color
  boxShadow2: Color
  boxShadow3: Color
}

export interface Grids {
  sm: number
  md: number
  lg: number
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {
    grids: Grids

    // shadows
    shadow1: string

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
