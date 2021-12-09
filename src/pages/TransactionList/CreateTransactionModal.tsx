import React, { useState, useCallback } from 'react'
import styled from 'styled-components/macro'
import Modal from '@/components/Modal'
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined'
import { Space, Radio, Input } from 'antd'
import { ButtonPrimary } from '@/components/Button'
import { TYPESTATE } from './hooks'

const CloseWrapper = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
`
const InputBox = styled.div`
  margin-top: 18px;
`
const InputItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  label {
    width: 20%;
  }
`

type CreateTransactionType = {
  isOpen: boolean
  onClose: () => void
  fromAddress?: string
  changeFromAddress: (e: any) => void
  toAddress?: string
  changeToAddress: (e: any) => void
  amount?: string
  changeAmount: (e: any) => void
  address?: string
  changeAddress: (e: any) => void
  method?: string
  changeMethod: (e: any) => void
  arg?: string
  changeArg: (e: any) => void
  createFn: () => void
  createType: number
  onChangeCreateType: (e: any) => void
}

export default function CreateTransactionModal({
  isOpen,
  onClose,
  fromAddress,
  changeFromAddress,
  toAddress,
  changeToAddress,
  createFn,
  createType,
  onChangeCreateType,
  amount,
  changeAmount,
  address,
  changeAddress,
  method,
  changeMethod,
  arg,
  changeArg,
}: CreateTransactionType) {
  return (
    <Modal isOpen={isOpen}>
      <CloseWrapper onClick={() => onClose && onClose()}>
        <CloseOutlined />
      </CloseWrapper>
      <Space>
        <Radio.Group onChange={onChangeCreateType} value={createType}>
          <Radio value={TYPESTATE.TRANSFER}>转账</Radio>
          <Radio value={TYPESTATE.METHOD}>方法</Radio>
        </Radio.Group>
      </Space>
      {createType === TYPESTATE.TRANSFER ? (
        <InputBox>
          <InputItem>
            <label>from</label>
            <Input allowClear={true} value={fromAddress} onChange={changeFromAddress} placeholder="from" />
          </InputItem>
          <InputItem>
            <label>to</label>
            <Input allowClear={true} value={toAddress} onChange={changeToAddress} placeholder="to" />
          </InputItem>
          <InputItem>
            <label>amount</label>
            <Input type="number" value={amount} onChange={changeAmount} allowClear={true} placeholder="amount" />
          </InputItem>
        </InputBox>
      ) : (
        <InputBox>
          <InputItem>
            <label>address</label>
            <Input allowClear={true} value={address} onChange={changeAddress} placeholder="address" />
          </InputItem>
          <InputItem>
            <label>method</label>
            <Input allowClear={true} value={method} onChange={changeMethod} placeholder="method" />
          </InputItem>
          <InputItem>
            <label>arg</label>
            <Input type="number" value={arg} onChange={changeArg} allowClear={true} placeholder="arg" />
          </InputItem>
        </InputBox>
      )}

      <ButtonPrimary onClick={createFn}>创建</ButtonPrimary>
    </Modal>
  )
}
