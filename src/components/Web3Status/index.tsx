import React, { useMemo } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken, lighten } from 'polished'
import { Activity } from 'react-feather'
import styled, { useTheme } from 'styled-components'
import { NetworkContextName } from '../../constants/misc'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../Button'

// import Loader from '../Loader'

// import { RowBetween } from '../Row'
import { RowBetween } from '../Row'
import { TYPE } from '@/theme'
import Loader from '../Loader'
import { isTransactionRecent, useAllTransactions } from '@/state/transactions/hooks'
import { TransactionDetails } from '@/state/transactions/reducer'

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

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Web3StatusInner() {
  const { account, error } = useWeb3React()
  const allTransactions = useAllTransactions()
  const theme = useTheme()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)

  const hasPendingTransactions = !!pending.length

  if (account) {
    return (
      <Web3StatusConnected id="web3-status-connected" pending={hasPendingTransactions}>
        {/* <Web3StatusConnected id="web3-status-connected" pending={true}> */}

        {hasPendingTransactions ? (
          // {true ? (
          <RowBetween style={{ gap: '4px' }}>
            <TYPE.body color="white">{pending?.length} Pending</TYPE.body> <Loader stroke={theme.white} />
          </RowBetween>
        ) : (
          <TYPE.body color="white">{shortenAddress(account ?? '', true ? 4 : 2)}</TYPE.body>
        )}
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
  const { active } = useWeb3React()
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
