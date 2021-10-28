import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken, lighten } from 'polished'
import React, { useEffect, useMemo } from 'react'
import { Activity } from 'react-feather'
import styled, { css } from 'styled-components'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import FortmaticIcon from '../../assets/images/fortmaticIcon.png'
import PortisIcon from '../../assets/images/portisIcon.png'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import { fortmatic, injected, portis, walletconnect, walletlink } from '../../connectors'
import { NetworkContextName } from '../../constants/misc'
// import useENSName from '../../hooks/useENSName'
// import { useHasSocks } from '../../hooks/useSocksBalance'
// import { useWalletModalToggle } from '../../state/application/hooks'
// import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
// import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../Button'

import * as Icon from '@/components/Icon'
import Identicon from '../Identicon'
// import Loader from '../Loader'

// import { RowBetween } from '../Row'
import { MEDIUM, px2vwm } from 'utils/adapteH5'
import Row, { RowBetween } from '../Row'
import { isTransactionRecent, useAllTransactions } from '@/store/transaction/hooks'
import { TransactionDetail } from '@/store/transaction/reducer'
import Loader from '../Loader'
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'

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

  @media (max-width: ${MEDIUM}) {
    padding: ${px2vwm`5px`};
    & > p {
      font-size: ${px2vwm`13px`};
      font-weight: 500;
      color: ${({ theme }) => theme.primary1};
      line-height: ${px2vwm`19px`};
    }
  }
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  background-color: ${({ pending, theme }) => (pending ? theme.primary1 : theme.black)};
  border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : darken(0.5, theme.white))};
  color: ${({ pending, theme }) => (pending ? theme.white : theme.white)};
  font-weight: 500;

  font-size: 12px;
  line-height: 17px;
  padding: 5px 15px;

  border-radius: 16px;

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

  @media (max-width: ${MEDIUM}) {
    /* padding: ${px2vwm`5px`}; */
    /* padding: 5px; */
    border: 1px solid transparent;
    padding: 3px 10px;
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

  /* @media (max-width: ${MEDIUM}) {
    font-size: ${px2vwm`16px`};
  } */
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;

  @media (max-width: ${MEDIUM}) {
    font-size: ${px2vwm`16px`};
    width: ${px2vwm`16px`};
    height: ${px2vwm`16px`};
  }
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetail, b: TransactionDetail) {
  return b.addedTime - a.addedTime
}

// function Sock() {
//   return (
//     <span role="img" aria-label={t`has socks emoji`} style={{ marginTop: -4, marginBottom: -4 }}>
//       🧦
//     </span>
//   )
// }

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

  // const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = useMemo(
    () => sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash),
    [sortedRecentTransactions]
  )

  const hasPendingTransactions = !!pending.length

  useEffect(() => {
    console.debug('[](allTransactions):', allTransactions)
  }, [allTransactions])
  // const hasSocks = useHasSocks()
  // const toggleWalletModal = useWalletModalToggle()

  const isPc = useIsPcByScreenWidth()

  if (account) {
    return (
      <Web3StatusConnected id="web3-status-connected" pending={hasPendingTransactions}>
        {/* <Web3StatusConnected id="web3-status-connected" pending={true}> */}
        <InnerWrapper>
          {hasPendingTransactions ? (
            // {true ? (
            <RowBetween>
              <Text>{pending?.length} Pending</Text>
              <Loader stroke="white" />
            </RowBetween>
          ) : (
            <>
              <WalletIcon>
                <Icon.Wallet />
              </WalletIcon>
              <Text>{shortenAddress(account ?? '', isPc ? 4 : 2)}</Text>
            </>
          )}
        </InnerWrapper>
        {/* 图标，钱包头像 */}
        {/* {connector && <StatusIcon connector={connector} />} */}
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
    // <Web3StatusConnect id="connect-wallet" faded={!account}>
    //   <WalletIcon>
    //     <Icon.Wallet />
    //   </WalletIcon>
    //   <Text>Connect to a wallet</Text>
    // </Web3StatusConnect>
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const context = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  // const { ENSName } = useENSName(account ?? undefined)

  // const allTransactions = useAllTransactions()

  // const sortedRecentTransactions = useMemo(() => {
  //   const txs = Object.values(allTransactions)
  //   return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  // }, [allTransactions])

  // const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  // const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

  // TODO H5端滑动屏幕，此log一直会打印，待查找原因
  console.debug('[contextNetwork, context]:', contextNetwork, context)

  if (!contextNetwork.active && !active) {
    return null
  }

  // TODO 钱包弹窗暂时阉割掉，后续要添加则添加

  return (
    <>
      <Web3StatusInner />
      {/* <WalletModal ENSName={undefined} pendingTransactions={['pending']} confirmedTransactions={['confirmed']} /> */}
      {/* <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} /> */}
    </>
  )
}
