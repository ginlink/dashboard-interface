import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import EthereumLogo from '../../assets/images/publicImg/ethereum-logo.png'
// import useHttpLocations from 'hooks/useHttpLocations'
// import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import Logo from '../Logo'
import active from '../../assets/images/publicImg/ative.svg'
// todo address
export const getTokenLogoURL = (address: string) => `https://tokens.pancakeswap.finance/images/${address}.png`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
  ...rest
}: {
  currency?: any
  size?: string
  style?: React.CSSProperties
}) {
  // const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (!currency || currency.isNative) return []

    if (currency.isToken) {
      const defaultUrls = [getTokenLogoURL(currency.address)]
      // if (currency instanceof WrappedTokenInfo) {
      //   return [...uriLocations, ...defaultUrls]
      // }
      return defaultUrls
    }
    return [active]
    // }, [currency, uriLocations])
  }, [currency])

  if (currency?.isNative) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} {...rest} />
  }
  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} {...rest} />
}
