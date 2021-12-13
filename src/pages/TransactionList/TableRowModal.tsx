import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import Modal from '@/components/Modal'
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined'
import { Input } from 'antd'
import { txType } from '@/constants/txType'
import { ButtonPrimary } from '@/components/Button'
import { TxPropsApi } from '@/services/api'

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

// export type RowItemType = {
//   id: number
//   txId: string
//   txHash: string
//   txType: string
//   txFrom: string
//   txTo: string
//   txAmount: string
//   txFun: string
//   txFunArg: string
//   tx_agent?: any
//   txData: string
//   txProaddr: string
//   tx_state?: number
// }

type TableRowModalType = {
  openRow: boolean
  item: TxPropsApi
  closeRowModal: () => void
  approveFn: (item: TxPropsApi) => void
  confrimFn: (item: TxPropsApi) => void
}

export default function TableRowModal({ openRow, item, closeRowModal, approveFn, confrimFn }: TableRowModalType) {
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
              <Input disabled={true} value={''} />
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
        <ButtonPrimary onClick={() => approveFn(item)}>授权</ButtonPrimary>
        <ButtonPrimary onClick={() => confrimFn(item)}>确认</ButtonPrimary>
      </BtnBox>
    </Modal>
  )
}
