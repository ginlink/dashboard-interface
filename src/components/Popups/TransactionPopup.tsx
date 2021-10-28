/*
 * @Author: jiangjin
 * @Date: 2021-09-16 15:52:50
 * @LastEditTime: 2021-09-17 14:24:28
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import { darken } from 'polished'
import React, { useContext } from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks/web3'
import { ExternalLink } from '../../theme/components'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

const Text = styled.div`
  color: ${({ theme }) => theme.black};
`

const ThisExternalLink = styled(ExternalLink)<{ success: boolean | undefined }>`
  color: ${({ theme, success }) => (success ? theme.green1 : theme.red1)};

  :hover {
    color: ${(props) => darken(0.05, props.success ? props.theme.green1 : props.theme.red1)};
  }
`

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const { chainId } = useActiveWeb3React()

  const theme = useContext(ThemeContext)

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? <CheckCircle color={theme.green1} size={24} /> : <AlertCircle color={theme.error} size={24} />}
      </div>
      <AutoColumn gap="8px">
        <Text>{summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}</Text>
        {chainId && (
          <ThisExternalLink success={success} href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}>
            View on Explorer
          </ThisExternalLink>
        )}
      </AutoColumn>
    </RowNoFlex>
  )
}
