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
import { parseFunc } from './util'
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

  const [currentOption, setCurrentOption] = useState<number | undefined>()

  const [optionArr, setOptionArr] = useState<Array<any>>([
    {
      name: 'swap-mining',
      key: 1,
    },
    {
      name: 'Ownable',
      key: 2,
    },
    {
      name: 'position-reward',
      key: 3,
    },
  ])
  useEffect(() => {
    //swap-mining abi
    const swapMiningFilterAbi = swapMiningAbi.abi.filter((v) => v.type === 'function')

    const parsedFunc = parseFunc(swapMiningFilterAbi)
    console.log('[](parsedFunc):', parsedFunc)

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
    const positionRewardFilterAbi = positionRewardAbi.filter((v) => v.type === 'function')
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
    (e) => {
      changeMethod(e)

      // const arg =
      // setArgPlaceHolder()
    },
    [changeMethod]
  )

  const changeOption = useCallback(
    (e) => {
      if (!library || !account || !chainId) return

      const obj = optionArr.find((v) => v.key === e)

      const address = obj.name

      setCurrentOption(e)

      changeAddress(address)

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
            positionRewardAbi,
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
            <label></label>
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
            <label>method</label>
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
            <label>arg</label>
            <Input type="number" value={arg} onChange={changeArg} allowClear={true} placeholder="arg" />
          </InputItem>
        </InputBox>
      )}

      <ButtonPrimary onClick={createFn}>创建</ButtonPrimary>
    </Modal>
  )
}
