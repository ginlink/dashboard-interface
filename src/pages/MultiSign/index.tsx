import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { Steps, Button } from 'antd'
const { Step } = Steps
import { useActiveWeb3React } from '@/hooks/web3'
import { isAddress } from '@/utils'
import ReviewComponent from './ReviewComponent'
import SafetyNoxName from './SafetyNoxName'
import ConfirmComponent from './ConfirmComponent'
import { Link } from 'react-router-dom'
const steps = [
  {
    title: '保险箱名称',
  },
  {
    title: '所有者和确认',
  },
  {
    title: '审查',
  },
]

const Wrapper = styled.div`
  .steps-content {
    margin-top: 16px;
    padding: 24px;
    background-color: #fafafa;
    border: 1px dashed #e9e9e9;
    border-radius: 4px;
  }

  .steps-action {
    margin-top: 24px;
  }
`
export type OwnerType = {
  ownerName: string
  ownerAddress: any
  errorMsg: string
}
export default function MultiSign() {
  const { account } = useActiveWeb3React()
  const [current, setCurrent] = useState<number>(0)
  const [nameValue, setNameValue] = useState<any>('')
  const [confrimNum, setConfrimNum] = useState<number>(1)

  const myWallet: OwnerType = {
    ownerName: '我的钱包',
    ownerAddress: account,
    errorMsg: '',
  }

  const [ownerList, setOwnerList] = useState<Array<OwnerType>>([myWallet])
  const ownerNum = useMemo(() => {
    return ownerList.map((v, index) => {
      return index + 1
    })
  }, [ownerList])

  const checkAddress = useCallback((address: string) => {
    if (!isAddress(address)) return -1
    return 1
  }, [])

  const next = useCallback(() => {
    const tempList = [...ownerList]
    tempList.map((v) => {
      if (checkAddress(v.ownerAddress) == -1) {
        v.errorMsg = '地址错误，请检查地址'
      }
    })
    setOwnerList(tempList)
    const hasErr = tempList.findIndex((v) => v.errorMsg !== '')
    if (hasErr != -1) return
    setCurrent(current + 1)
  }, [checkAddress, current, ownerList])

  const prev = useCallback(() => {
    setCurrent(current - 1)
  }, [current])

  const doneFn = useCallback(() => {
    console.log('nameValue', nameValue, confrimNum, ownerList)
  }, [confrimNum, nameValue, ownerList])

  const changeNameValue = useCallback((e) => {
    setNameValue(e.target.value)
  }, [])

  const changeOwnerName = useCallback(
    (e, index) => {
      const value = e.target.value
      const tempList = [...ownerList]
      const ownerObj = tempList[index]
      ownerObj.ownerName = value
      tempList[index] = ownerObj
      setOwnerList(tempList)
    },
    [ownerList]
  )

  const changeOwnerAddress = useCallback(
    (e, index) => {
      const value = e.target.value
      const tempList = [...ownerList]
      const ownerObj = tempList[index]
      ownerObj.ownerAddress = value
      if (checkAddress(value) == -1) {
        ownerObj.errorMsg = '地址错误，请检查地址'
      } else {
        ownerObj.errorMsg = ''
      }
      tempList[index] = ownerObj
      setOwnerList(tempList)
    },
    [checkAddress, ownerList]
  )

  const addOwner = useCallback(() => {
    const ownerObj = {
      ownerName: '',
      ownerAddress: '',
      errorMsg: '',
    }
    const tempList = [...ownerList]
    tempList.push(ownerObj)
    setOwnerList(tempList)
  }, [ownerList])

  const deleteOwner = useCallback(
    (index) => {
      const tempList = [...ownerList]
      tempList.splice(index, 1)
      setOwnerList(tempList)
    },
    [ownerList]
  )

  const handleChange = useCallback((value) => {
    setConfrimNum(Number(value))
  }, [])

  return (
    <Wrapper>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">
        {current === 0 ? (
          <SafetyNoxName nameValue={nameValue} changeNameValue={changeNameValue}></SafetyNoxName>
        ) : current === 1 ? (
          <ConfirmComponent
            ownerList={ownerList}
            confrimNum={confrimNum}
            ownerNum={ownerNum}
            addOwner={addOwner}
            changeOwnerName={changeOwnerName}
            changeOwnerAddress={changeOwnerAddress}
            deleteOwner={deleteOwner}
            handleChange={handleChange}
          ></ConfirmComponent>
        ) : (
          <ReviewComponent nameValue={nameValue} ownerList={ownerList} confrimNum={confrimNum}></ReviewComponent>
        )}
      </div>
      <div className="steps-action">
        {current > 0 && (
          <Button size="large" style={{ margin: '0 8px' }} onClick={() => prev()}>
            后退
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button size="large" type="primary" onClick={doneFn}>
            <Link to="/multiSign/create">创建</Link>
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button size="large" type="primary" onClick={() => next()}>
            继续
          </Button>
        )}
      </div>
    </Wrapper>
  )
}
