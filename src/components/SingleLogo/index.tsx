import React, { useCallback, useState, useMemo } from 'react'
import getImgUrlByAddress from '@/utils/getImgUrlByAddress'
import defaultLogo from '../../assets/images/publicImg/ative.svg'
import styled from 'styled-components/macro'

const SingLogoSwapper = styled.div<{ isShowMargin?: boolean; size?: number }>`
  margin-right: ${({ isShowMargin }) => (isShowMargin ? '6px' : 0)};
  img {
    width: ${({ size }) => (size && size > -1 ? size + 'px' : '22px')};
    height: ${({ size }) => (size && size > -1 ? size + 'px' : '22px')};
    border-radius: ${({ size }) => (size && size > -1 ? size + 'px' : '22px')};
    box-shadow: 0px 6px 10px rgb(0 0 0 / 8%);
    background-color: ${(props) => props.theme.white};
  }
`

interface SingleLogoInterface {
  currency: any
  isShowMargin?: boolean
  size?: number
}
export default function SingleLogo({ currency, isShowMargin = false, size }: SingleLogoInterface) {
  const [imgSrc, setImgSrc] = useState<string | undefined>()
  const src = useMemo(() => {
    if (currency?.isToken) {
      return getImgUrlByAddress(currency?.address)
    }
    return defaultLogo
  }, [currency])

  const imgError = useCallback(() => {
    setImgSrc(defaultLogo)
  }, [])
  return (
    <SingLogoSwapper className={'logo-img-style'} size={size} isShowMargin={isShowMargin}>
      <img src={imgSrc ? imgSrc : src} alt="" id="logoImg" onError={imgError} />
    </SingLogoSwapper>
  )
}
