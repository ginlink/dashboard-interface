import React, { useState, useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components/macro'
import Modal from '@/components/Modal'
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined'
import { Space, Radio, Input, Select, message } from 'antd'
import { ButtonPrimary } from '@/components/Button'
import { TYPESTATE } from './hooks'

import swapMiningAbi from '@/abis/swap-mining.json'
import ownableAbi from '@/abis/Ownable.json'
import positionRewardAbi from '@/abis/position-reward.json'
import { ContractAddresses, parseAbis, StaticBaseContract } from './util'
import { Contract } from '@ethersproject/contracts'
import { getSignerOrProvider, SWAP_MINING_ADDRESSES } from '@/hooks/useContract'
import { useActiveWeb3React } from '@/hooks/web3'
import { TRANSACTION_OPERATABLE_ADDRESS, TRANSACTION_POSITION_REWARD_ADDRESS } from '@/constants/address'

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

export enum CallType {
  TRANSFER = 1,
  METHOD,
}

const { Option } = Select

export type CreateTransactionProps = {
  isOpen: boolean
  onClose?: () => void
  onChangeCallType?: (type: CallType) => void
  onFinished?: (values: any) => void
}

const abiArr = [swapMiningAbi, ownableAbi, positionRewardAbi]

const parsedAbis = parseAbis(abiArr as StaticBaseContract[])
console.log('[](parsedAbis):', parsedAbis)

export default function CreateTransactionModal({
  isOpen,
  onClose,
  onChangeCallType,
  onFinished,
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

    return parsedAbis[contractName].funcs
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

      changeContract && changeContract(contract)
    },
    [account, changeContract, contractAddresses, library]
  )

  const onChangeMethodHandler = useCallback(
    (methodName: string, option: any) => {
      debugger
      if (!methodName || !contractMethods) return

      // update parent
      changeMethod(methodName)

      // update placeholder param
      const { key: index } = option
      const funcParam = contractMethods[index].param
      setFuncParams(funcParam)
    },
    [changeMethod, contractMethods]
  )

  return (
    <Modal isOpen={isOpen}>
      <CloseWrapper onClick={() => onClose && onClose()}>
        <CloseOutlined />
      </CloseWrapper>
      <Space>
        <Radio.Group
          value={createType}
          onChange={(e) => {
            const type: CallType = e.target.value
            setCallType(type)
            onChangeCallType && onChangeCallType(type)
          }}
        >
          <Radio value={TYPESTATE.TRANSFER}>转账</Radio>
          <Radio value={TYPESTATE.METHOD}>方法</Radio>
        </Radio.Group>
      </Space>

      {callType === CallType.TRANSFER ? (
        <InputBox>
          <InputItem>
            <label>token地址</label>
            <Input allowClear={true} value={fromAddress} onChange={changeFromAddress} placeholder="from" />
          </InputItem>
          <InputItem>
            <label>接收人地址</label>
            <Input allowClear={true} value={toAddress} onChange={changeToAddress} placeholder="to" />
          </InputItem>
          <InputItem>
            <label>数量</label>
            <Input type="number" value={amount} onChange={changeAmount} allowClear={true} placeholder="amount" />
          </InputItem>
        </InputBox>
      ) : (
        <InputBox>
          <InputItem>
            <label>合约类型</label>
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
          </InputItem>
          <InputItem>
            <label>合约方法</label>
            <Select onChange={onChangeMethodHandler} style={{ width: '100%' }} allowClear>
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
          </InputItem>
          <InputItem>
            <label>合约参数</label>
            <Input value={arg} onChange={changeArg} allowClear={true} placeholder={funcParams} />
          </InputItem>
        </InputBox>
      )}

      <ButtonPrimary onClick={onFinished}>创建</ButtonPrimary>
    </Modal>
  )
}
