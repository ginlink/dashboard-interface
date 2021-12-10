import React from 'react'
import styled from 'styled-components/macro'
import { useTxStatus } from './hooks'
import { RowItemType } from './TableRowModal'

type TxStatusType = {
  text: string
  record: RowItemType
}
const Wrapper = styled.div``
export default function TxStatus({ text, record }: TxStatusType) {
  const getStatus = useTxStatus(record)
  return <Wrapper>{getStatus}</Wrapper>
}
