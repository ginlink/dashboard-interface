import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import Modal from '@/components/Modal'
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined'
import { Input } from 'antd'
import { txType } from '@/constants/txType'
import { ButtonPrimary } from '@/components/Button'

export type RowItemType = {
  id: any
  tx_id: any
  tx_hash: any
  tx_type: any
  tx_from: any
  tx_to: any
  tx_amount: any
  tx_fun: any
  tx_fun_arg: any
  tx_agent: any
  tx_data: any
  tx_proaddr: any
}
type TableRowModalType = {
  openRow: boolean
  item: RowItemType
  closeRowModal: () => void
  approveFn: (item: RowItemType) => void
  confrimFn: (item: RowItemType) => void
}

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
export default function TableRowModal({ openRow, item, closeRowModal, approveFn, confrimFn }: TableRowModalType) {
  return (
    <Modal isOpen={openRow}>
      <CloseWrapper onClick={() => closeRowModal && closeRowModal()}>
        <CloseOutlined />
      </CloseWrapper>
      {item.tx_type == txType.TRANSFER ? (
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
      )}
      <BtnBox>
        <ButtonPrimary onClick={() => approveFn(item)}>授权</ButtonPrimary>
        <ButtonPrimary onClick={() => confrimFn(item)}>确认</ButtonPrimary>
      </BtnBox>
    </Modal>
  )
}
