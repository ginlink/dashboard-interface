import { TxPropsApi, TxStatusEnum } from '@/services/api'
import React from 'react'
import styled from 'styled-components/macro'

type TxStatusType = {
  text: any
  record: TxPropsApi
}

const Wrapper = styled.div``

function getState(state: TxStatusEnum) {
  switch (state) {
    case TxStatusEnum.SUCCESS:
      return '已完成'
    case TxStatusEnum.LOADING:
      return '进行中'
    case TxStatusEnum.FAILED:
      return '已失效'
    default:
      return '--'
  }
  return
}

export default function TxStatus({ text, record }: TxStatusType) {
  console.log('[](record):', record, text)

  return <Wrapper>{getState(text)}</Wrapper>
}
