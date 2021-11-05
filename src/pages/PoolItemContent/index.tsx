import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Input, notification } from 'antd'
import styled from 'styled-components/macro'
import { usePositionContract } from '@/hooks/useContract'

const QueryBtn = styled.div`
  cursor: pointer;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 4px 8px;
  border-radius: 4px;
  width: max-content;
  margin: 10px 0;
`

const PoolItemContent = styled.div``
const MethodName = styled.div`
  margin-bottom: 10px;
`
const TokenBox = styled.div`
  margin-bottom: 10px;
`
interface poolItemInterface {
  name: string
  addr: string
}
export default function PoolItemContentComponent({ item }: { item: poolItemInterface }) {
  const contract = usePositionContract(item.addr)
  const [token0, setToken0] = useState<string>()
  const [token1, setToken1] = useState<string>()

  useEffect(() => {
    if (contract) {
      contract?.token0().then((res) => {
        setToken0(res)
      })
      contract?.token1().then((res) => {
        setToken1(res)
      })
    }
  }, [contract])

  const clickQuery = useCallback(() => {
    contract
      ?.collectProtocol(token0 || '')
      .then((res: any) => {
        console.log('success:', res)
      })
      .catch((err) => {
        notification['error']({
          message: '错误信息',
          description: err.toString(),
        })
      })
  }, [contract, token0])
  return (
    <PoolItemContent>
      <MethodName>collectProtocol</MethodName>
      <TokenBox>token0：{token0}</TokenBox>
      <TokenBox>token1：{token1}</TokenBox>
      <Input value={token0} />
      <QueryBtn onClick={() => clickQuery}>Write</QueryBtn>
    </PoolItemContent>
  )
}
