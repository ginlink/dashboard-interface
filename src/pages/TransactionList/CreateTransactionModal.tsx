import React, { useState, useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components/macro'
import Modal from '@/components/Modal'
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined'
import { Space, Radio, Input, Select, message, Form, Button } from 'antd'
import { ButtonPrimary } from '@/components/Button'
import { TYPESTATE } from './hooks'

import swapMiningAbi from '@/abis/swap-mining.json'
import ownableAbi from '@/abis/Ownable.json'
import positionRewardAbi from '@/abis/position-reward.json'
import { ContractAddresses, parseAbis, StaticBaseContract } from './util'
import { Contract } from '@ethersproject/contracts'
import { getSignerOrProvider, SWAP_MINING_ADDRESSES } from '@/hooks/useContract'
import { useActiveWeb3React } from '@/hooks/web3'
import { TRANSACTION_OPERATABLE_ADDRESS, TRANSACTION_POSITION_REWARD_ADDRESS } from '@/constants/addresses'
import { isAddress } from '@ethersproject/address'
import { FuncType } from '../CallAdmin/util'

const { Option } = Select

const CloseWrapper = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
`

const InputBox = styled.div`
  margin-top: 18px;
`
const SpaceBox = styled.div`
  margin: 20px 0;
`
const InputItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  label {
    width: 20%;
  }
`

export type TransferParams = {
  amount?: string
  fromAddress?: string
  toAddress?: string
}

export type MethodParams = {
  contractName?: string
  funcParams?: string
  arg?: string
}

export enum CallType {
  TRANSFER = 1,
  METHOD,
}

export type CreateTransactionProps = {
  isOpen: boolean
  onClose?: () => void
  onChangeCallType?: (type: CallType) => void
  onFinished?: (values: any) => void
  onChangeContract?: (contract: any) => void
  onChangeTokenAddress?: (address: string) => void
}

const abiArr = [swapMiningAbi, ownableAbi, positionRewardAbi]

const parsedAbis = parseAbis(abiArr as StaticBaseContract[])
console.log('[](parsedAbis):', parsedAbis)

export default function CreateTransactionModal({
  isOpen,
  onClose,
  onChangeCallType,
  onFinished,
  onChangeContract,
  onChangeTokenAddress,
}: CreateTransactionProps) {
  const { library, account, chainId } = useActiveWeb3React()

  const [funcParams, setFuncParams] = useState<string | undefined>(undefined)

  const [contractName, setContractName] = useState<string | undefined>(undefined)

  const [callType, setCallType] = useState(CallType.TRANSFER)

  const contractAddresses: ContractAddresses | undefined = useMemo(() => {
    if (!chainId) return

    return {
      SwapMining: SWAP_MINING_ADDRESSES[chainId],
      Ownable: TRANSACTION_OPERATABLE_ADDRESS[chainId],
      positionReward: TRANSACTION_POSITION_REWARD_ADDRESS[chainId],
    }
  }, [chainId])

  const contractMethods = useMemo(() => {
    if (!parsedAbis || !contractName) return

    return parsedAbis[contractName].funcs?.filter((item) => item.type == FuncType.WRITE)
  }, [contractName])

  const onChangeContractHandler = useCallback(
    (contractName: string, option: any) => {
      if (!contractName) return

      const { key } = option

      // update
      setContractName(contractName)
      if (!contractAddresses || !parsedAbis || !library || !account) return

      debugger

      // update parent contract
      const contractAddress = contractAddresses[contractName]
      const contractAbi = parsedAbis[contractName]?.abi

      const contract = new Contract(contractAddress, contractAbi, getSignerOrProvider(library, account))

      if (!contract) return message.warning('[err] create contract')

      onChangeContract && onChangeContract(contract)
    },
    [account, onChangeContract, contractAddresses, library]
  )

  const onChangeMethodHandler = useCallback(
    (methodName: string, option: any) => {
      debugger
      if (!methodName || !contractMethods) return

      // update placeholder param
      const { key: index } = option
      const funcParam = contractMethods[index].param
      setFuncParams(funcParam)
    },
    [contractMethods]
  )

  const onFinish = (values: any) => {
    if (!onFinished) return
    console.log('参数', values)
    onFinished(values)
  }

  const rules = useMemo(() => {
    return {
      fromAddress: [
        { required: true, message: '请输入token地址!' },
        ({ getFieldValue }: { getFieldValue: any }) => ({
          validator(_: any, value: string) {
            if (!isAddress(value)) return Promise.reject('地址格式错误')

            return Promise.resolve()
          },
        }),
      ],
      toAddress: [
        { required: true, message: '请输入接收人地址!' },
        ({ getFieldValue }: { getFieldValue: any }) => ({
          validator(_: any, value: string) {
            if (!isAddress(value)) return Promise.reject('地址格式错误')

            return Promise.resolve()
          },
        }),
      ],
      amount: [{ required: true, message: '请输入数量!' }],
      contractName: [{ required: true, message: '请选择合约类型!' }],
      funcParams: [{ required: true, message: '请选择合约方法!' }],
      arg: [],
    }
  }, [])

  const onChangeTokenAddressHandler = useCallback(
    (address: string) => {
      if (!isAddress(address)) return

      onChangeTokenAddress && onChangeTokenAddress(address)
    },
    [onChangeTokenAddress]
  )

  return (
    <Modal isOpen={isOpen}>
      <CloseWrapper onClick={() => onClose && onClose()}>
        <CloseOutlined />
      </CloseWrapper>
      <Space>
        <Radio.Group
          value={callType}
          onChange={(e) => {
            const type: CallType = e.target.value
            setCallType(type)
            onChangeCallType && onChangeCallType(type)
          }}
        >
          <Radio value={CallType.TRANSFER}>转账</Radio>
          <Radio value={CallType.METHOD}>方法</Radio>
        </Radio.Group>
      </Space>
      <SpaceBox></SpaceBox>

      {callType === CallType.TRANSFER ? (
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          initialValues={{ remember: false }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="token地址" name="fromAddress" rules={rules.fromAddress}>
            <Input
              onChange={(e) => onChangeTokenAddressHandler(e.target.value)}
              allowClear={true}
              placeholder="token地址"
            />
          </Form.Item>
          <Form.Item label="接收人地址" name="toAddress" rules={rules.toAddress}>
            <Input allowClear={true} placeholder="接收人地址" />
          </Form.Item>
          <Form.Item label="数量" name="amount" rules={rules.amount}>
            <Input allowClear={true} placeholder="数量" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 5, span: 20 }}>
            <Button type="primary" htmlType="submit">
              创建
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: false }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="合约类型" name="contractName" rules={rules.contractName}>
            <Select defaultValue="" style={{ width: '100%' }} allowClear onChange={onChangeContractHandler}>
              {parsedAbis &&
                Object.keys(parsedAbis).map((key, index) => {
                  return (
                    <Option value={key} key={index}>
                      {key}
                    </Option>
                  )
                })}
            </Select>
          </Form.Item>
          <Form.Item label="合约方法" name="funcParams" rules={rules.funcParams}>
            {/* <Select onChange={onChangeMethodHandler} style={{ width: '100%' }} allowClear> */}
            <Select onChange={onChangeMethodHandler} allowClear>
              {contractMethods &&
                contractMethods.map((item, index) => {
                  const { nameAndParam } = item
                  return (
                    <Option value={nameAndParam ?? ''} key={index}>
                      {nameAndParam}
                    </Option>
                  )
                })}
            </Select>
          </Form.Item>
          <Form.Item label="合约参数" name="arg" rules={rules.arg}>
            <Input placeholder={funcParams} allowClear={true} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
            <Button type="primary" htmlType="submit">
              创建
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}
