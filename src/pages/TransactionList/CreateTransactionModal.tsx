import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import Modal from '@/components/Modal'
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined'
import { Space, Radio, Input, Select, message, Form, Button, FormInstance } from 'antd'

import swapMiningAbi from '@/abis/swap-mining.json'
import swapMiningAbi_v1 from '@/abis/swap-mining_v1.json'
import SPCTokenABI from 'abis/SPCToken.json'
import ownableAbi from '@/abis/Ownable.json'
import positionRewardAbi from '@/abis/position-reward.json'
import positionRewardAbi_v1 from '@/abis/position-reward_v1.json'
import swapROuterAbi from 'abis/SwapRouter.json'
import GnosisSafeAbi from 'abis/GnosisSafe.json'
import SpcDAOAbi from 'abis/SpcDAO.json'
import vSpcTokenAbi from 'abis/vSpcToken.json'
import WBNBAbi from 'abis/erc20bnb.json'
import { ContractAddresses, parseAbis, StaticBaseContract } from './util'
import { Contract } from '@ethersproject/contracts'
import { getSignerOrProvider } from '@/hooks/useContract'
import { useActiveWeb3React } from '@/hooks/web3'
import {
  TRANSACTION_OPERATABLE_ADDRESS,
  TRANSACTION_POSITION_REWARD_ADDRESS,
  TRANSACTION_POSITION_REWARD_ADDRESS_V1,
  TRANSACTION_SWAPMING_ADDRESSES,
  TRANSACTION_SWAPMING_ADDRESSES_V1,
  TRANSACTION_ROUTER_ADDRESS,
  TRANSACTION_MULTISEND_ADDRESS,
  TRANSACTION_SPCTOKEN_ADDRESS,
  TRANSACTION_PROXY_ADDRESS,
  TRANSACTION_DAO_ADDRESS,
  TRANSACTION_VSPC_ADDRESS,
  WBNB_ADDRESS,
} from '@/constants/addresses'
import { isAddress } from '@ethersproject/address'
import { FuncType } from '../CallAdmin/util'
import { TYPE } from '@/theme'
import Loader from '@/components/Loader'
import Row from '@/components/Row'
import { ButtonPrimary } from '@/components/Button'

// crv abi

import RegistryAbi from 'abis/PoolRegistry.json'
import crv_factoryAbi from 'abis/crv_factory.json'
import crypto_factoryAbi from 'abis/crypto_factory.json'
import CurveCryptoSwap3ETHAbi from 'abis/CurveCryptoSwap3ETH_abi.json'
import CryptoBasePoolabi from 'abis/CryptoBasePool_abi.json'
import stockAbi from 'abis/Stock.json'
import lockerAbi from 'abis/lock.json'
import boostAbi from 'abis/Boost.json'
import crvswapMiningAbi from 'abis/CRVSwapMining.json'
import GaugeControllerAbi from 'abis/GaugeController.json'
import SwapMiningControllerAbi from 'abis/SwapMiningController.json'

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

const MyButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  border-radius: 4px;
  /* padding: 8px 16px; */
  line-height: 1;
`

export type TransferParams = {
  amount?: string
  fromAddress?: string
  toAddress?: string
}

export type MethodParams = {
  contractName?: string
  funcName?: string
  contractAddr?: string
  arg?: string
}

export enum CallType {
  TRANSFER = 1,
  METHOD,
}

export type CreateTransactionProps = {
  isOpen: boolean
  form: FormInstance
  isCreating?: boolean
  onClose?: () => void
  onChangeCallType?: (type: CallType) => void
  onFinished?: (values: any) => void
  onChangeContract?: (contract: any) => void
  onChangeTokenAddress?: (address: string) => void
}

const abiArr = [
  swapMiningAbi,
  ownableAbi,
  positionRewardAbi,
  swapROuterAbi,
  GnosisSafeAbi,
  swapMiningAbi_v1,
  positionRewardAbi_v1,
  SPCTokenABI,
  SpcDAOAbi,
  vSpcTokenAbi,
  WBNBAbi,
  RegistryAbi,
  crv_factoryAbi,
  crypto_factoryAbi,
  CurveCryptoSwap3ETHAbi,
  CryptoBasePoolabi,
  stockAbi,
  lockerAbi,
  boostAbi,
  crvswapMiningAbi,
  GaugeControllerAbi,
  SwapMiningControllerAbi,
]

const parsedAbis = parseAbis(abiArr as StaticBaseContract[])
console.log('[](parsedAbis):', parsedAbis)

export default function CreateTransactionModal({
  isOpen,
  form,
  isCreating,
  onClose,
  onChangeCallType,
  onFinished,
  onChangeContract,
  onChangeTokenAddress,
}: CreateTransactionProps) {
  const { library, account, chainId } = useActiveWeb3React()

  const [funcName, setFuncParams] = useState<string | undefined>(undefined)

  const [contractAddress, setContractAddress] = useState<string | undefined>(undefined)

  const [contractName, setContractName] = useState<string | undefined>(undefined)

  const [callType, setCallType] = useState(CallType.TRANSFER)

  // const [createTransactionForm] = Form.useForm()

  const contractAddresses: ContractAddresses | undefined = useMemo(() => {
    if (!chainId) return

    return {
      SwapMining: TRANSACTION_SWAPMING_ADDRESSES[chainId],
      Ownable: TRANSACTION_OPERATABLE_ADDRESS[chainId],
      positionReward: TRANSACTION_POSITION_REWARD_ADDRESS[chainId],
      SwapRouter: TRANSACTION_ROUTER_ADDRESS[chainId],
      GnosisSafe: TRANSACTION_PROXY_ADDRESS[chainId],
      SwapMining_v1: TRANSACTION_SWAPMING_ADDRESSES_V1[chainId],
      positionReward_v1: TRANSACTION_POSITION_REWARD_ADDRESS_V1[chainId],
      SPCToken: TRANSACTION_SPCTOKEN_ADDRESS[chainId],
      SpcDAO: TRANSACTION_DAO_ADDRESS[chainId],
      vSpcToken: TRANSACTION_VSPC_ADDRESS[chainId],
      WBNB: WBNB_ADDRESS[chainId],
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
      if (!contractName || !contractAddresses) return
      // update
      setContractName(contractName)
      const address = contractAddresses[contractName]
      if (address) {
        setContractAddress(address)
      }
    },
    [contractAddresses]
  )

  const newContract = useCallback(() => {
    if (!contractAddresses || !parsedAbis || !library || !account || !contractAddress || !contractName) return

    const contractAbi = parsedAbis[contractName]?.abi

    const contract = new Contract(contractAddress, contractAbi, getSignerOrProvider(library, account))

    if (!contract) return message.warning('[err] create contract')

    onChangeContract && onChangeContract(contract)
  }, [account, contractAddress, contractAddresses, contractName, library, onChangeContract])

  const onChangeMethodHandler = useCallback(
    (methodName: string, option: any) => {
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
    newContract()
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
      contractAddr: [
        { required: true, message: '' },
        () => ({
          validator(_: any, value: string) {
            if (!isAddress(value)) return Promise.reject('地址格式错误')
            setContractAddress(value)
            return Promise.resolve()
          },
        }),
      ],

      toAddress: [
        { required: true },
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
          </>
        ) : (
          <>
            <Form.Item label="合约地址" name="contractAddr" rules={rules.contractAddr}>
              <Input placeholder={'合约地址'} allowClear={true} />
            </Form.Item>
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
          </>
        )}

        <Form.Item wrapperCol={{ offset: 5, span: 20 }}>
          <MyButtonPrimary type="primary" disabled={isCreating}>
            {isCreating ? (
              <Row style={{ gap: '4px', alignItems: 'center' }}>
                <TYPE.body fontSize={14} color="white">
                  创建
                </TYPE.body>
                <Loader size="14px" stroke="white" />
              </Row>
            ) : (
              <TYPE.body fontSize={14} color="#fff">
                创建
              </TYPE.body>
            )}
          </MyButtonPrimary>
        </Form.Item>
      </Form>
    </Modal>
  )
}
