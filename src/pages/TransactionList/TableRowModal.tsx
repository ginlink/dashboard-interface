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
//   tx_id: string
//   tx_hash: string
//   tx_type: string
//   tx_from: string
//   tx_to: string
//   tx_amount: string
//   tx_fun: string
//   tx_fun_arg: string
//   tx_agent?: any
//   tx_data: string
//   tx_proaddr: string
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
      {item?.tx_type ? (
        item.tx_type == txType.TRANSFER ? (
          <InputBox>
            <InputItem>
              <label>from</label>
              <Input disabled={true} value={item.tx_from} />
            </InputItem>
            <InputItem>
              <label>to</label>
              <Input disabled={true} value={item.tx_to} />
            </InputItem>
            <InputItem>
              <label>amount</label>
              <Input disabled={true} type="number" value={item.tx_amount} />
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
              <Input disabled={true} value={item.tx_fun} />
            </InputItem>
            <InputItem>
              <label>arg</label>
              <Input disabled={true} value={item.tx_fun_arg} />
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
