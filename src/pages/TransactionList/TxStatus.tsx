import React from 'react'
import styled from 'styled-components/macro'
import { TXSTATE, useTxStatus } from './hooks'
import { RowItemType } from './TableRowModal'

type TxStatusType = {
  text: any
  record: RowItemType
}
const Wrapper = styled.div``
function getState(state: number) {
  switch (state) {
    case TXSTATE.COMPLETED:
      return '已完成'
    case TXSTATE.HAVEINHAND:
      return '进行中'
    case TXSTATE.INVALID:
      return '已失效'
    default:
      return '--'
  }
  return
}
export default function TxStatus({ text, record }: TxStatusType) {
  // console.log('record:', record)
  // const getStatus = useTxStatus(record)
  // return <Wrapper>{getStatus}</Wrapper>
  return <Wrapper>{getState(text)}</Wrapper>
}
