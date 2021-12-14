import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import Modal from '@/components/Modal'
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined'
import { Space, Radio, Input, Select, message, Form, Button } from 'antd'

import swapMiningAbi from '@/abis/swap-mining.json'
import ownableAbi from '@/abis/Ownable.json'
import positionRewardAbi from '@/abis/position-reward.json'
import swapROuterAbi from 'abis/SwapRouter.json'
import GnosisSafeAbi from 'abis/GnosisSafe.json'
import { ContractAddresses, parseAbis, StaticBaseContract } from './util'
import { Contract } from '@ethersproject/contracts'
import { getSignerOrProvider } from '@/hooks/useContract'
import { useActiveWeb3React } from '@/hooks/web3'
import {
  TRANSACTION_OPERATABLE_ADDRESS,
  TRANSACTION_POSITION_REWARD_ADDRESS,
  TRANSACTION_SWAPMING_ADDRESSES,
  TRANSACTION_ROUTER_ADDRESS,
  TRANSACTION_MULTISEND_ADDRESS,
  TRANSACTION_PROXY_ADDRESS,
} from '@/constants/addresses'
import { isAddress } from '@ethersproject/address'
import { FuncType } from '../CallAdmin/util'

const { Option } = Select

const CloseWrapper = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
`

const SpaceBox = styled.div`
  margin: 20px 0;
`

export type TransferParams = {
  amount?: string
  fromAddress?: string
  toAddress?: string
}

export type MethodParams = {
  contractName?: string
  funcName?: string
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

const abiArr = [swapMiningAbi, ownableAbi, positionRewardAbi, swapROuterAbi, GnosisSafeAbi]

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

  const [funcName, setFuncParams] = useState<string | undefined>(undefined)

  const [contractName, setContractName] = useState<string | undefined>(undefined)

  const [callType, setCallType] = useState(CallType.TRANSFER)

  const [form] = Form.useForm()

  const contractAddresses: ContractAddresses | undefined = useMemo(() => {
    if (!chainId) return

    return {
      SwapMining: TRANSACTION_SWAPMING_ADDRESSES[chainId],
      Ownable: TRANSACTION_OPERATABLE_ADDRESS[chainId],
      positionReward: TRANSACTION_POSITION_REWARD_ADDRESS[chainId],
      SwapRouter: TRANSACTION_ROUTER_ADDRESS[chainId],
      GnosisSafe: TRANSACTION_PROXY_ADDRESS[chainId],
    }
  }, [chainId])

  const contractMethods = useMemo(() => {
    if (!parsedAbis || !contractName) return

    return parsedAbis[contractName].funcs?.filter((item) => item.type == FuncType.WRITE)
    // return parsedAbis[contractName].funcs
  }, [contractName])

  // TODO按钮状态

  // const isReady = useMemo(() => {
  //   const values = form.getFieldsValue()

  //   console.log('[](values):', values)

  //   return true
  // }, [form])

  const onChangeContractHandler = useCallback(
    (contractName: string, option: any) => {
      if (!contractName) return

      const { key } = option

      // update
      setContractName(contractName)
      if (!contractAddresses || !parsedAbis || !library || !account) return

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
      const funcParam = contractMethods[index].name
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
        () => ({
          validator(_: any, value: string) {
            if (!isAddress(value)) return Promise.reject('地址格式错误')

            return Promise.resolve()
          },
        }),
      ],
      toAddress: [
        { required: true, message: '请输入接收人地址!' },
        () => ({
          validator(_: any, value: string) {
            if (!isAddress(value)) return Promise.reject('地址格式错误')

            return Promise.resolve()
          },
        }),
      ],
      amount: [{ required: true, message: '请输入数量!' }],
      contractName: [{ required: true, message: '请选择合约类型!' }],
      funcName: [{ required: true, message: '请选择合约方法!' }],
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

            // form.
          }}
        >
          <Radio value={CallType.TRANSFER}>转账</Radio>
          <Radio value={CallType.METHOD}>方法</Radio>
        </Radio.Group>
      </Space>
      <SpaceBox></SpaceBox>

      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} onFinish={onFinish} autoComplete="off" form={form}>
        {callType === CallType.TRANSFER ? (
          <>
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
          </>
        ) : (
          <>
            <Form.Item label="合约类型" name="contractName" rules={rules.contractName}>
              <Select style={{ width: '100%' }} allowClear onChange={onChangeContractHandler}>
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
            <Form.Item label="合约方法" name="funcName" rules={rules.funcName}>
              {/* <Select onChange={onChangeMethodHandler} style={{ width: '100%' }} allowClear> */}
              <Select onChange={onChangeMethodHandler} allowClear>
                {contractMethods &&
                  contractMethods.map((item, index) => {
                    const { nameAndParam, name } = item
                    return (
                      <Option value={name ?? ''} key={index}>
                        {nameAndParam}
                      </Option>
                    )
                  })}
              </Select>
            </Form.Item>
            <Form.Item label="合约参数" name="arg" rules={rules.arg}>
              <Input placeholder={funcName} allowClear={true} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
              {/* <Button type="primary" htmlType="submit" disabled={!isReady}> */}
              <Button type="primary" htmlType="submit">
                创建
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  )
}
