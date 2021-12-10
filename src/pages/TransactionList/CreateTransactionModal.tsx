import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components/macro'
import Modal from '@/components/Modal'
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined'
import { Space, Radio, Input, Select } from 'antd'
import { ButtonPrimary } from '@/components/Button'
import { TYPESTATE } from './hooks'

import swapMiningAbi from '@/abis/swap-mining.json'
import ownableAbi from '@/abis/Ownable.json'
import positionRewardAbi from '@/abis/position-reward.json'
import { parseAbis, parseFunc, StaticBaseContract } from './util'
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

const { Option } = Select
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
  changeContract?: (contract: Contract | undefined) => void
}

const abiArr = [swapMiningAbi, ownableAbi, positionRewardAbi]

const parsedAbis = parseAbis(abiArr as StaticBaseContract[])
// console.log('[](parsedAbis):', parsedAbis)

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
  changeContract,
}: CreateTransactionType) {
  const { library, account, chainId } = useActiveWeb3React()

  const [swapMiningMethods, setSwapMiningMethods] = useState<Array<any>>([])
  const [ownableMethods, setOwnableMethods] = useState<Array<any>>([])
  const [positionRewardMethods, setPositionRewardMethods] = useState<Array<any>>([])
  const [methodOptionArr, setMethodOptionArr] = useState<Array<string>>([])

  const [funcParams, setFuncParams] = useState<string | undefined>(undefined)

  const [currentOptionIndex, setCurrentOptionIndex] = useState<number | undefined>()

  const [optionArr, setOptionArr] = useState<Array<any>>([
    {
      name: 'SwapMining',
      key: 1,
    },
    {
      name: 'Ownable',
      key: 2,
    },
    {
      name: 'positionReward',
      key: 3,
    },
  ])

  useEffect(() => {
    //swap-mining abi
    const swapMiningFilterAbi = swapMiningAbi.abi.filter((v) => v.type === 'function')

    const swapMiningReadData = [] as any
    const swapMiningWriteData = [] as any
    swapMiningFilterAbi.map((v: any) => {
      if (v.stateMutability === 'view') {
        swapMiningReadData.push(v.name)
      } else {
        swapMiningWriteData.push(v.name)
      }
    })
    console.log('[swapMiningReadData, swapMiningWriteData]', [swapMiningReadData, swapMiningWriteData])
    setSwapMiningMethods([swapMiningReadData, swapMiningWriteData])

    //Ownable abi
    const ownableFilterAbi = ownableAbi.abi.filter((v) => v.type === 'function')
    const ownableReadData = [] as any
    const ownableWriteData = [] as any
    ownableFilterAbi.map((v: any) => {
      if (v.stateMutability === 'view') {
        ownableReadData.push(v.name)
      } else {
        ownableWriteData.push(v.name)
      }
    })
    console.log('[ownableReadData, ownableWriteData]', [ownableReadData, ownableWriteData])
    setOwnableMethods([ownableReadData, ownableWriteData])

    //position-reward abi
    const positionRewardFilterAbi = positionRewardAbi.abi.filter((v) => v.type === 'function')
    const positionRewardReadData = [] as any
    const positionRewardWriteData = [] as any
    positionRewardFilterAbi.map((v: any) => {
      if (v.stateMutability === 'view') {
        positionRewardReadData.push(v.name)
      } else {
        positionRewardWriteData.push(v.name)
      }
    })
    console.log('[positionRewardReadData, positionRewardWriteData]', [positionRewardReadData, positionRewardWriteData])
    setPositionRewardMethods([positionRewardReadData, positionRewardWriteData])
  }, [])

  const changeMethodName = useCallback(
    (name) => {
      changeMethod(name)

      setFuncParams(undefined)

      // placeholder param
      if (!name || !parsedAbis || !currentOptionIndex) return

      const parsedFuncs = parsedAbis[optionArr[currentOptionIndex - 1].name]?.funcs

      if (!parsedFuncs) return

      const params = parsedFuncs.find((item) => item.name == name)?.param

      setFuncParams(params)
    },
    [changeMethod, currentOptionIndex, optionArr]
  )

  const changeOption = useCallback(
    (e) => {
      if (!library || !account || !chainId) return

      const obj = optionArr.find((v) => v.key === e)

      const address = obj?.name

      setCurrentOptionIndex(e)

      changeAddress(address)

      setFuncParams(undefined)

      let contract: Contract | undefined = undefined
      switch (e) {
        case 1:
          contract = new Contract(
            SWAP_MINING_ADDRESSES[chainId],
            swapMiningAbi.abi,
            getSignerOrProvider(library, account)
          )
          setMethodOptionArr(swapMiningMethods[1])
          break
        case 2:
          contract = new Contract(
            TRANSACTION_OPERATABLE_ADDRESS[chainId],
            ownableAbi.abi,
            getSignerOrProvider(library, account)
          )
          setMethodOptionArr(ownableMethods[1])
          break
        case 3:
          contract = new Contract(
            TRANSACTION_POSITION_REWARD_ADDRESS[chainId],
            positionRewardAbi.abi,
            getSignerOrProvider(library, account)
          )
          setMethodOptionArr(positionRewardMethods[1])
          break
        default:
          break
      }
      changeAddress(address)
      changeContract && changeContract(contract)
    },
    [
      account,
      chainId,
      changeAddress,
      changeContract,
      library,
      optionArr,
      ownableMethods,
      positionRewardMethods,
      swapMiningMethods,
    ]
  )
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
            {/* <Input allowClear={true} value={address} onChange={changeAddress} placeholder="address" /> */}
            <Select defaultValue="" style={{ width: 200 }} allowClear onChange={changeOption}>
              {optionArr.map((v: any, index: number) => {
                return (
                  <Option value={v.key} key={index}>
                    {v.name}
                  </Option>
                )
              })}
            </Select>
          </InputItem>
          <InputItem>
            <label>合约方法</label>
            {/* <Input allowClear={true} value={method} onChange={changeMethod} placeholder="method" /> */}
            <Select onChange={changeMethodName} style={{ width: 200 }} allowClear>
              {methodOptionArr.map((v: any, index: number) => {
                return (
                  <Option value={v} key={index}>
                    {v}
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

      <ButtonPrimary onClick={createFn}>创建</ButtonPrimary>
    </Modal>
  )
}
