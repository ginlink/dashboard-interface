import React, { useContext } from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks/web3'
import { TYPE } from '../../theme'
import { ExternalLink } from '../../theme/components'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
// import { SPC_TOKEN } from '../../constants/addresses'
import successImg from '@/assets/images/popup/success.png'
import failImg from '@/assets/images/popup/fail.png'
const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
  .popup-img-style {
    img {
      width: 57px;
      height: 50px;
    }
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
  const ExplorerDataTypes = ExplorerDataType.TRANSACTION
  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }} className="popup-img-style">
        {/* {success ? <CheckCircle color={theme.green1} size={24} /> : <AlertCircle color={theme.red1} size={24} />} */}
        {success ? <img src={successImg} alt="" /> : <img src={failImg} alt="" />}
      </div>
      <AutoColumn gap="8px">
        <TYPE.body fontWeight={500}>
          {/* { ExplorerDataTypes ? 'Copy Success' : 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)} */}
          {summary ? summary : 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}
        </TYPE.body>
        {/* {chainId && (
          <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataTypes)}>View on Explorer</ExternalLink>
        )} */}
      </AutoColumn>
    </RowNoFlex>
  )
}
