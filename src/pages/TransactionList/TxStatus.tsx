import { useTransactionProxy } from '@/hooks/useContract'
import React, { useState, useMemo } from 'react'
import styled from 'styled-components/macro'

type TxStatusType = {
  text: any
}
const Wrapper = styled.div``
export default function TxStatus({ text }: TxStatusType) {
  const transactionProxy = useTransactionProxy()
  const [nonce, setNonce] = useState<any>()
  transactionProxy?.nonce().then((res) => {
    setNonce(res.toString())
  })
  const getStatus = useMemo(() => {
    if (!nonce) {
      return ''
    }
    if (nonce == text) {
      return '进行中'
    }
    if (nonce > text) {
      return '已完成'
    }
  }, [nonce, text])
  return <Wrapper>{getStatus}</Wrapper>
}
