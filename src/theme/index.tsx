import React, { useMemo } from 'react'
import { TextProps as TextPropsOriginal, Text } from 'rebass'
import styled, {
  createGlobalStyle,
  css,
  DefaultTheme,
  ThemeProvider as StyledComponentsThemeProvider,
} from 'styled-components'
import { Colors } from './styled'
export * from './components'

type TextProps = Omit<TextPropsOriginal, 'css'>

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#162133'

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // text
    text0: '#121c41',
    text1: '#000000',
    text2: '#8f94a9',
    text3: '#565a69',

    text4: '#C3C5CB',
    text5: '#EDEEF2',

    text6: '#0076FF',
    text7: '#8F94A9',
    text8: '#bdc8da',
    text9: '#ffab36',
    text10: '#8391a8',
    text11: '#00b594',

    // backgrounds / greys
    bg0: darkMode ? black : '#FFF',
    bg1: darkMode ? black : '#f5f6fa',
    bg2: darkMode ? black : '#F7F8FA',
    bg3: darkMode ? black : '#e0e6f1',
    bg4: 'rgba(255, 255, 255, 0.1)',
    bg5: darkMode ? black : 'rgba(136, 141, 155, 1)',
    bg6: '#EDEEF2',

    bg7: '#E5F1FF',
    bg8: '#edeef2',
    bg9: '#FFAB36',
    bg10: '#1F92FF',
    bg11: '#6EFACC',
    bg12: '#162033',
    bg13: '#0e192c',

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',

    // box-shadow
    bs0: 'rgba(224,230,242,1)',

    //primary colors
    primary1: '#1890ff',
    primary2: '#8391a8',
    primary3: 'rgba(0, 118, 255, 0.4)',
    primary4: 'rgba(0, 118, 255, 0.5)',
    primary5: '#EDEEF2',
    primary6: '#0958B4',

    // color text
    primaryText1: '#0076ff',
    primaryText2: darkMode ? white : '#565a69',
    primaryText3: '#050508',
    primaryText4: 'rgba(255, 255, 255, 1)',
    primaryText5: 'rgba(122, 60, 239, 1)',
    primaryText6: 'rgba(157, 158, 175, 1)',

    // secondary colors
    secondary1: '#E8006F',
    secondary2: 'rgba(0, 118, 255, 0.5)',

    secondary3: '#f1ecfd',

    // other
    red1: '#DA2D2B',
    red2: '#DF1F38',
    red3: '#D60000',
    green1: '#00c3a0',
    yellow1: '#ff9b39',

    yellow2: '#FF8F00',
    yellow3: '#F3B71E',
    blue1: '#0068FC',
    blue2: '#0068FC',
    error: '#DF1F38',
    success: '#007D35',
    warning: '#FF8F00',

    borderColor: '#CADFFB',
    borderColor2: '#E5E5E5',
    borderColor3: '#787D90',

    boxShadow1: 'rgba(12, 23, 41, 1)',
    boxShadow2: 'rgba(7, 17, 34, 1)',
    boxShadow3: 'rgba(9, 14, 22, 0.5)',
    // dont wanna forget these blue yet
    // blue4: '#C4D9F8',
    // blue5: '#EBF4FF',
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeObject = useMemo(() => theme(true), [])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors; fontSize: string }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  label(props: TextProps) {
    return <TextWrapper fontWeight={600} color={'white'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'blue1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow3'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text1'} {...props} />
  },
}

// TODO 1.改动Divide以适配移动端
export const Divide = styled.div<{ lang?: string | undefined }>`
  height: ${(props) => (props.lang ? props.lang : '30px')};
`

export const ThemedGlobalStyle = createGlobalStyle`
  html,
  body {
    color: ${({ theme }) => theme.text0};
    line-height: 1;

    box-sizing: border-box;

    font-variant: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
    font-family: 'Inter', sans-serif;

    font-weight: 500;
  }

  h1,
  a{
    color: ${({ theme }) => theme.white}; 
  }
  a,a:link,a:visited,a:hover,a:active{
    text-decoration: none;
  }

  ::selection{
    background-color: ${(props) => props.theme.primary1};
  }


  /* 初始化input */
  input{
    background-color: unset;
    border: none;
  }
  input:focus-visible {
    outline: none;
  }

  /* 让placehoder默认文字颜色为白色 */
  input::-webkit-input-placeholder {
    color:rgba(255,255,255,0.7);
  }
  
  input::-moz-placeholder {  /* Firefox 19+ */
    color:rgba(255,255,255,0.7);
  }
  
  input:-ms-input-placeholder {  
    color:rgba(255,255,255,0.7);
  }
`
