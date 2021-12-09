import React, { useState, useEffect, createRef, useCallback, useRef } from 'react'
import styled from 'styled-components/macro'
import { Table, Tag, Space } from 'antd'
import { getTransctionList, addTx } from '@/services/api'
import { Modal, Button } from 'antd'
import CreateTransactionModal from './CreateTransactionModal'
import { ButtonPrimary } from '@/components/Button'

const columns = [
  {
    title: '事务ID',
    dataIndex: 'tx_id',
    key: 'tx_id',
  },
  {
    title: '授权hash',
    dataIndex: 'tx_hash',
    key: 'tx_hash',
  },
  {
    title: '事务类型',
    dataIndex: 'tx_type',
    key: 'tx_type',
  },
  {
    title: 'from',
    dataIndex: 'tx_from',
    key: 'tx_from',
  },
  {
    title: 'to',
    dataIndex: 'tx_to',
    key: 'tx_to',
  },
  {
    title: '数量',
    dataIndex: 'tx_amount',
    key: 'tx_amount',
  },
  {
    title: '方法',
    dataIndex: 'tx_fun',
    key: 'tx_fun',
  },
  {
    title: '方法参数',
    dataIndex: 'tx_fun_arg',
    key: 'tx_fun_arg',
  },
]

const Wrapper = styled.div``
const CreateButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
`
const BtnBox = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  button {
    margin-left: 14px;
  }
`
export default function TransactionList() {
  const [dataList, setDataList] = useState<any>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [fromAddress, setFromAddress] = useState<any>()
  const [toAddress, setToAddress] = useState<any>()
  const [amount, setAmount] = useState<any>()
  const [address, setAddress] = useState<any>()
  const [method, setMethod] = useState<any>()
  const [arg, setArg] = useState<any>()
  const [createType, setCreateType] = useState<number>(1)

  useEffect(() => {
    getTransctionList().then((res) => {
      setDataList(res.data)
    })
  }, [])
  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])
  const changeFromAddress = useCallback((e) => {
    setFromAddress(e.target.value)
  }, [])
  const changeToAddress = useCallback((e) => {
    setToAddress(e.target.value)
  }, [])
  const changeAmount = useCallback((e) => {
    setAmount(e.target.value)
  }, [])
  const changeAddress = useCallback((e) => {
    setAddress(e.target.value)
  }, [])
  const changeMethod = useCallback((e) => {
    setMethod(e.target.value)
  }, [])
  const changeArg = useCallback((e) => {
    setArg(e.target.value)
  }, [])
  const createFn = useCallback(async () => {
    const addParam = {
      txType: createType,
      txFrom: '',
      txTo: '',
      txAmount: '',
      txHash: '1111111',
      txFun: '',
      txFunArg: '',
    }
    if (createType === 1) {
      console.log(fromAddress, toAddress, amount)
      addParam.txFrom = fromAddress
      addParam.txTo = toAddress
      addParam.txAmount = amount
    } else {
      console.log(address, method, arg)
      addParam.txFun = method
      addParam.txFunArg = arg
    }
    const res = await addTx(addParam)
    if (res.code === 200) {
      getTransctionList().then((res) => {
        setDataList(res.data)
      })
    }
    setFromAddress('')
    setToAddress('')
    setAmount('')
    setAddress('')
    setMethod('')
    setArg('')
    setIsOpen(false)
  }, [address, amount, arg, createType, fromAddress, method, toAddress])
  const onChangeCreateType = useCallback((e) => {
    setCreateType(e.target.value)
  }, [])
  return (
    <Wrapper>
      <BtnBox>
        {/* <ButtonPrimary>11</ButtonPrimary> */}
        <CreateButtonPrimary
          onClick={() => {
            setCreateType(1)
            setIsOpen(true)
          }}
        >
          创建事务
        </CreateButtonPrimary>
      </BtnBox>
      <Table pagination={false} columns={columns} dataSource={dataList} />
      <CreateTransactionModal
        onClose={onClose}
        isOpen={isOpen}
        fromAddress={fromAddress}
        changeFromAddress={changeFromAddress}
        toAddress={toAddress}
        changeToAddress={changeToAddress}
        amount={amount}
        changeAmount={changeAmount}
        method={method}
        changeMethod={changeMethod}
        address={address}
        changeAddress={changeAddress}
        arg={arg}
        changeArg={changeArg}
        createFn={createFn}
        createType={createType}
        onChangeCreateType={onChangeCreateType}
      ></CreateTransactionModal>
    </Wrapper>
  )
}
