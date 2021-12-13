import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import Modal from '@/components/Modal'
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined'
import { Input } from 'antd'
import { txType } from '@/constants/txType'
import { ButtonPrimary } from '@/components/Button'
import { TxPropsApi } from '@/services/api'
import { shortenAddress } from '@/utils'
import { SafeProxyInfo } from './index'
import { SafeSignature } from '@/utils/execution'
import Row from '@/components/Row'
import { useActiveWeb3React } from '@/hooks/web3'

const CloseWrapper = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
`
const InputBox = styled.div`
  margin-top: 30px;
`
const InputItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  label {
    width: 20%;
  }
`
const BtnBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 80px;
  button {
    width: 36%;
  }
`
const OwnesBox = styled.div`
  margin-top: 14px;
`
const OwnesItem = styled(Row)`
  margin-top: 14px;
  justify-content: space-between;
`
const OwnesSinger = styled.div<{
  color: string
}>`
  color: ${({ color }) => color};
`
type TableRowModalType = {
  openRow: boolean
  item: TxPropsApi
  closeRowModal: () => void
  approveFn: (item: TxPropsApi) => void
  confrimFn: (item: TxPropsApi) => void
  safeProxyInfo?: SafeProxyInfo
  nonce?: number
}

export default function TableRowModal({
  openRow,
  item,
  closeRowModal,
  approveFn,
  confrimFn,
  safeProxyInfo,
  nonce,
}: TableRowModalType) {
  const current = useMemo(() => {
    if (nonce == undefined || item.txId == undefined) return true

    if (nonce.toString() < item.txId) {
      return true
    }
    return false
  }, [item.txId, nonce])
  const { account } = useActiveWeb3React()
  const signatures = useMemo(() => {
    let _signaures: SafeSignature[] | undefined = undefined
    try {
      _signaures = item.txSingal ? JSON.parse(item.txSingal) : undefined
    } catch (err) {
      console.log('[](err):', err)
    }

    return _signaures
  }, [item])
  const findSigner = (address: string) => {
    if (!signatures || nonce == undefined) return -1
    return signatures?.findIndex((res) => {
      return res.signer.toLocaleLowerCase() == address.toLocaleLowerCase()
    })
  }
  const userIsApporve = useMemo(() => {
    if (!account || !safeProxyInfo) return true
    if (current) return true
    const isOnwer = safeProxyInfo.owners?.findIndex((res) => {
      return res.toLocaleLowerCase() == account.toLocaleLowerCase()
    })
    if (isOnwer == -1) return true
    if (findSigner(account) >= 0) {
      return true
    }
    return false
  }, [account, current, safeProxyInfo])

  const openSuccess = useMemo(() => {
    if (!signatures || !safeProxyInfo || safeProxyInfo.threshold == undefined || nonce == undefined) return true
    if (current) return true
    if (signatures.length >= safeProxyInfo.threshold) return false
    return true
  }, [current, nonce, safeProxyInfo, signatures])

  return (
    <Modal isOpen={openRow}>
      <CloseWrapper onClick={() => closeRowModal && closeRowModal()}>
        <CloseOutlined />
      </CloseWrapper>
      {item?.txType ? (
        item.txType == txType.TRANSFER ? (
          <InputBox>
            <InputItem>
              <label>from</label>
              <Input disabled={true} value={item.txFrom} />
            </InputItem>
            <InputItem>
              <label>to</label>
              <Input disabled={true} value={item.txTo} />
            </InputItem>
            <InputItem>
              <label>amount</label>
              <Input disabled={true} type="number" value={item.txAmount} />
            </InputItem>
          </InputBox>
        ) : (
          <InputBox>
            <InputItem>
              <label>address</label>
              <Input disabled={true} value={item.txFrom} />
            </InputItem>
            <InputItem>
              <label>method</label>
              <Input disabled={true} value={item.txFun} />
            </InputItem>
            <InputItem>
              <label>arg</label>
              <Input disabled={true} value={item.txFunArg} />
            </InputItem>
          </InputBox>
        )
      ) : (
        <>123</>
      )}
      <BtnBox>
        <ButtonPrimary onClick={() => approveFn(item)} disabled={userIsApporve}>
          授权
        </ButtonPrimary>
        <ButtonPrimary onClick={() => confrimFn(item)} disabled={openSuccess}>
          确认
        </ButtonPrimary>
      </BtnBox>
      <OwnesBox>
        {safeProxyInfo?.owners?.map((res: string) => {
          return (
            <OwnesItem key={res}>
              {shortenAddress(res, 6)}
              {findSigner(res) >= 0 ? (
                <OwnesSinger color={'green'}>已授权</OwnesSinger>
              ) : (
                <OwnesSinger color={'#8b8686'}>未授权</OwnesSinger>
              )}
            </OwnesItem>
          )
        })}
      </OwnesBox>
    </Modal>
  )
}
