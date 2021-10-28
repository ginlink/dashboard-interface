import React, { memo, useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { ReactComponent as LangIcon } from '@/assets/images/sider/lang.svg'
// import { useUserLocaleManager } from 'state/user/hooks'
import { AbsBase, StyledInternalLink } from '../../theme'
// import { DEFAULT_LOCALE, SupportedLocale } from 'constants/locales'
// import { useActiveLocale, navigatorLocale } from 'hooks/useActiveLocale'
// import useParsedQueryString from 'hooks/useParsedQueryString'
import { stringify } from 'querystring'
import { useLocation } from 'react-router-dom'
import { MEDIUM, px2vwm } from '@/utils/adapteH5'
// import { AbsBase } from 'pages/Home'
import { supportLangList } from '@/constants/misc'

const ChangeLang = styled.div`
  position: relative;

  height: 100%;

  font-size: 16px;
  line-height: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.white};

  display: flex;
  align-items: center;

  svg {
    g {
      filter: none;
      stroke: ${(props) => props.theme.white};
    }
    path {
      stroke: ${(props) => props.theme.white};
      fill: ${(props) => props.theme.white};
    }
  }

  &:hover .lang-title {
    color: ${(props) => props.theme.primary1};
  }
  &:hover svg {
    g {
      filter: none;
      stroke: ${(props) => props.theme.primary1};
    }
    path {
      stroke: ${(props) => props.theme.primary1};
      fill: ${(props) => props.theme.primary1};
    }
  }
  &:hover .change-menu {
    display: block;
    /* opacity: 1;
    left: 0; */
  }

  & .change-menu:hover {
    display: block;
    /* opacity: 1;
    left: 0; */
  }

  @media (max-width: ${MEDIUM}) {
    font-size: 0.8rem;
    line-height: ${px2vwm(22)};
  }
`
const LangeMenu = styled(AbsBase)<{ width?: string }>`
  bottom: 60px;
  width: ${({ ispc, width }) => (ispc && width) || '182px'};

  /* z-index: 1; */

  /* background-color: ${(props) => props.theme.white};

  box-shadow: 0px 4px 8px 0px ${({ theme }) => theme.bs0};
  border-radius: 10px; */

  background: ${(props) => props.theme.black};
  box-shadow: 0px 2px 26px 0px ${(props) => props.theme.boxShadow1};
  border-radius: 8px;

  text-align: center;
  display: none;

  @media (max-width: ${MEDIUM}) {
    width: ${({ ispc, width }) => (!ispc && width && px2vwm(width)) || '115px'};
    bottom: 0;
  }
`
const LangeItem = styled.div`
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.text2};
  cursor: pointer;

  margin-top: 11px;

  &:last-child {
    margin-bottom: 11px;
  }
  &:hover {
    color: ${(props) => props.theme.primary1};
  }
`
const LangTitle = styled.span`
  margin-left: 12px;
  cursor: pointer;

  @media (max-width: ${MEDIUM}) {
    margin-left: 0;
  }
`
const MyLangIcon = styled(LangIcon)`
  @media (max-width: ${MEDIUM}) {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
`

function LangCrad({ onDismiss, ...props }: any) {
  // const [locale] = useUserLocaleManager()
  // const activeLocale = useActiveLocale()
  // const browserLocale = useMemo(() => navigatorLocale(), [])
  const location = useLocation()
  // const qs = useParsedQueryString()

  const locale = 'zh-CN'

  // let targetLocale: SupportedLocale
  // if (activeLocale === browserLocale) {
  //   targetLocale = DEFAULT_LOCALE
  // } else {
  //   targetLocale = browserLocale
  // }

  // const target = useCallback(
  //   (targetLocale: string) => {
  //     return {
  //       ...location,
  //       search: stringify({ ...qs, lng: targetLocale }),
  //     }
  //   },
  //   [location, qs]
  // )

  // const changeLang = useCallback((item: any) => {
  //   // ReactGA.event({
  //   //   category: 'Localization',
  //   //   action: 'Switch Locale',
  //   //   label: `${activeLocale} -> ${targetLocale}`,
  //   // })

  //   console.log('[item]:', item)
  //   // 切换语言
  // }, [])

  // useEffect(() => {
  //   onDismiss && onDismiss()

  //   console.log('[locale]:', locale)
  // }, [locale])
  return (
    <>
      <ChangeLang>
        <LangeMenu {...props} className="change-menu">
          {supportLangList.map((item: any) => {
            return (
              // <StyledInternalLink key={item.id} onClick={() => changeLang(item)} to={target(item.symbol)}>
              //   <LangeItem>{item.title}</LangeItem>
              // </StyledInternalLink>
              <StyledInternalLink key={item.id} to="/">
                <LangeItem>{item.title}</LangeItem>
              </StyledInternalLink>
            )
          })}
        </LangeMenu>
        <MyLangIcon />
        <LangTitle className="lang-title">
          {supportLangList.find((item: any) => locale == item.symbol)?.title || supportLangList[0].title}
        </LangTitle>
      </ChangeLang>
    </>
  )
}

export default memo(LangCrad)
