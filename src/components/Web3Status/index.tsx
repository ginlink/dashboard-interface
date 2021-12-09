import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken, lighten } from 'polished'
import React from 'react'
import { Activity } from 'react-feather'
import styled, { css } from 'styled-components'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import FortmaticIcon from '../../assets/images/fortmaticIcon.png'
import PortisIcon from '../../assets/images/portisIcon.png'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import { fortmatic, injected, portis, walletconnect, walletlink } from '../../connectors'
import { NetworkContextName } from '../../constants/misc'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../Button'

import Identicon from '../Identicon'
// import Loader from '../Loader'

// import { RowBetween } from '../Row'
import Row from '../Row'
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'
import { TYPE } from '@/theme'

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: unset;
  align-items: center;
  padding: 5px 15px;
  border-radius: 16px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
    box-shadow: unset;
    border-color: transparent;
  }

  :hover,
  :active {
    box-shadow: unset;
    border-color: transparent;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
  background-color: ${({ theme }) => theme.black};
  border: 1px solid ${(props) => props.theme.primary1};
  svg {
    p,
    path {
      /* stroke: ${(props) => props.theme.primary1}; */
      fill: ${(props) => props.theme.primary1};
    }
  }
  :hover,
  :focus {
    border: 1px solid ${({ theme }) => darken(0.1, theme.primary1)};
  }

  ${({ faded }) =>
    faded &&
    css`
      background-color: transparent;
      border: 1px solid ${({ theme }) => darken(0.5, theme.white)};
      color: ${({ theme }) => darken(0.1, theme.white)};

      :hover,
      :focus {
        /* border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)}; */
        border: 1px solid ${({ theme }) => darken(0.05, theme.primary1)};
        /* color: ${({ theme }) => theme.primaryText1}; */
      }
    `};
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  background-color: ${({ pending, theme }) => (pending ? theme.primary1 : theme.black)};
  border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : darken(0.5, theme.white))};
  color: ${({ pending, theme }) => (pending ? theme.white : theme.white)};
  font-weight: 500;

  line-height: 17px;
  padding: 5px 15px;

  border-radius: 10px;

  /* background-color: red; */
  :hover,
  :focus {
    background-color: ${({ pending, theme }) => (pending ? darken(0.05, theme.primary1) : lighten(0.05, theme.black))};
    border: 1px solid ${({ pending, theme }) => (pending ? darken(0.1, theme.primary1) : darken(0.6, theme.white))};
    box-shadow: unset;
  }
  :active {
    border: 1px solid ${({ theme }) => darken(0.6, theme.white)};
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  width: fit-content;
  font-weight: 500;
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Identicon />
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <img src={WalletConnectIcon} alt={'WalletConnect'} />
      </IconWrapper>
    )
  } else if (connector === walletlink) {
    return (
      <IconWrapper size={16}>
        <img src={CoinbaseWalletIcon} alt={'CoinbaseWallet'} />
      </IconWrapper>
    )
  } else if (connector === fortmatic) {
    return (
      <IconWrapper size={16}>
        <img src={FortmaticIcon} alt={'Fortmatic'} />
      </IconWrapper>
    )
  } else if (connector === portis) {
    return (
      <IconWrapper size={16}>
        <img src={PortisIcon} alt={'Portis'} />
      </IconWrapper>
    )
  }
  return null
}

const InnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const WalletIcon = styled(Row)`
  width: unset;
  margin-right: 5px;

  svg {
    width: 20px;
    height: 20px;
  }
`

function Web3StatusInner() {
  const { account, connector, error } = useWeb3React()

  const isPc = useIsPcByScreenWidth()

  if (account) {
    return (
      <Web3StatusConnected id="web3-status-connected">
        {/* <Web3StatusConnected id="web3-status-connected" pending={true}> */}
        <InnerWrapper>
          <TYPE.main fontSize={14} color="white">
            {shortenAddress(account ?? '', isPc ? 4 : 2)}
          </TYPE.main>
        </InnerWrapper>
      </Web3StatusConnected>
    )
  } else if (error) {
    return (
      <Web3StatusError>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</Text>
      </Web3StatusError>
    )
  } else {
    return null
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
    </>
  )
}
