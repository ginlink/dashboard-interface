import { useTransactionProxy } from '@/hooks/useContract'
import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components/macro'
import { APPROVENUM, OWNERARR, useTxStatus } from './hooks'
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
