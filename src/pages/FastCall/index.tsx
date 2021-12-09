import { ButtonPrimary } from '@/components/Button'
import Column from '@/components/Column'
import Row from '@/components/Row'
import { TYPE } from '@/theme'
import { AutoComplete, Card, Collapse, Input, message, Space } from 'antd'
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { DownOutlined, CaretDownOutlined } from '@ant-design/icons'
import FunctionItem from './FunctionItem'
import { getSignerOrProvider } from '@/hooks/useContract'
import { useActiveWeb3React } from '@/hooks/web3'
import { ContractFunction, createContract, parseContract } from './util'
import Status, { StatusItem } from './Status'
import { ParsedFunc, parseFunc } from '../CallAdmin/util'
import { Contract } from '@ethersproject/contracts'
import moment from 'moment'
import { isAddress } from '@ethersproject/address'
import SelectedFuncItem from './SelectedFuncItem'
import { CloseSquareOutlined } from '@ant-design/icons'
import { addFunctionApi, CtFunction, searchFuncApi } from '@/services/api'
import { debounce } from '@/utils/debunce'

const { TextArea } = Input

export type ContractItem = {
  address?: string
  funcs?: ParsedFunc[]
  contract?: Contract
}

const Wrapper = styled.div``
const MyCard = styled(Card)`
  margin-top: 16px;
`

const MyButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  white-space: nowrap;
  border-radius: 10px;
`

const StatusWrapper = styled.div`
  width: 100%;
  min-height: 300px;
  max-height: 300px;
  /* min-height: 100px;
  max-height: 100px; */
  overflow-y: scroll;

  border: 1px solid ${({ theme }) => theme.bg3};
`

const SelectedFuncWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.bg3};

  flex: 1;
  min-height: 100px;
  max-height: 100px;

  overflow-y: scroll;
  padding: 8px 16px;
  border-radius: 10px;
`

// export type ContractItem = {
//   name: string
//   contract: Contract
// }

export default function FastCall() {
  const { library, account } = useActiveWeb3React()

  const statusRef = useRef<HTMLDivElement | null>(null)

  const [funcInput, setFuncInput] = useState<string | undefined>(
    undefined
    // 'function balanceOf (address account) external view returns(uint256)'
    // 'function approve (address spender, uint256 num) external'
    // // 'function balanceOf ()'
  )
  const [addressInput, setAddressInput] = useState<string | undefined>(undefined)
  // const [addressInput, setAddressInput] = useState<string | undefined>('0x5B8698f10555F5Fb4fE58BFfc2169790e526D8AD')

  const [statusList, setStatusList] = useState<StatusItem[] | undefined>(undefined)

  const [selectedFuncs, setSelectedFuncs] = useState<(ParsedFunc & CtFunction)[] | undefined>(undefined)

  const [contracts, setContracts] = useState<ContractItem[] | undefined>(undefined)

  const [activeKey, setActiveKey] = useState<string | string[] | undefined>(undefined)

  const [options, setOptions] = useState<{ value: string }[]>([])

  const onSearch = async (searchText: string) => {
    if (!searchText) return setOptions([])

    const searchRes: CtFunction[] | undefined = await searchFuncApi(searchText)

    if (!searchRes) return setOptions([])

    setOptions(
      searchRes.map((item) => {
        const { name, param, origin } = item

        // return { value: `${name} ${param}` }
        return { value: origin ?? '' }
      })
    )
  }

  // TODO防抖
  const onSearchDebounced = debounce(onSearch, 3000, true)

  const onSelect = (data: string) => {
    console.log('onSelect', data)
  }

  const onChange = (data: string) => {
    setFuncInput(data)
  }

  // TODO清空status
  const updateStatus = useCallback((content: string) => {
    const newStatus = {
      date: moment(),
      content: content,
    }

    setStatusList((prev) => {
      if (!prev) return [newStatus]

      return [...prev, newStatus]
    })
  }, [])

  useEffect(() => {
    const statusEl = statusRef.current
    debugger

    if (statusEl) {
      statusEl.scrollTop = statusEl.scrollHeight
    }
  }, [statusList])

  const onSelectHandler = useCallback(async () => {
    if (!funcInput) return message.error('请输入函数')

    let parsed: ParsedFunc | undefined = undefined
    try {
      parsed = parseFunc(funcInput)
    } catch (err: any) {
      return message.error(err?.message)
    }

    if (!parsed) return

    try {
      const resFuc: CtFunction = await addFunctionApi(parsed)

      setFuncInput('')

      setSelectedFuncs((prev) => {
        if (!prev) {
          message.success('添加成功')
          return [{ ...parsed, ...resFuc }]
        }

        if (prev.find((item) => item.id == resFuc.id)) {
          message.warning('已存在')
          return prev
        }

        message.success('添加成功')
        return [...prev, { ...parsed, ...resFuc }]
      })
    } catch (err) {
      console.log('[](err):', err)
    }
  }, [funcInput])

  const onCreateContractHandler = useCallback(() => {
    if (!selectedFuncs || !addressInput) return message.warning('请添加函数、并输入地址')

    if (!isAddress(addressInput)) return message.warning('请输入正确地址')

    const createdContract: Contract | undefined = createContract({
      library,
      account,
      address: addressInput,
      funcs: JSON.parse(JSON.stringify(selectedFuncs)),
    })

    debugger

    const contractItem: ContractItem = {
      address: addressInput,
      funcs: JSON.parse(JSON.stringify(selectedFuncs)),
      contract: createdContract,
    }

    setContracts((prev) => {
      if (!prev) return [contractItem]

      // prev?.push(contractItem)

      return [...prev, contractItem]
    })
  }, [account, addressInput, library, selectedFuncs])

  const onFuncCallHandler = useCallback(
    async (item: ParsedFunc, contract: Contract | undefined, params: string) => {
      const { name } = item

      debugger

      if (!contract || !name) return

      try {
        // contract[name].apply(null, params.split(',')).then((res: any) => console.log('[](res):', res))
        const res = await (params ? contract[name].apply(null, params.split(',')) : contract[name]())

        console.log('[](res):', res)
        updateStatus(JSON.stringify(res))
      } catch (err: any) {
        console.log('[onFuncCallHandler](err):', err)
        const message = err?.message

        // updateStatus(message ? message : '未知错误')
        updateStatus(JSON.stringify(err))
      }
    },
    [updateStatus]
  )

  useEffect(() => {
    console.log('[](statusList):', statusList)
  }, [statusList])

  return (
    <Wrapper>
      <MyCard>
        <Row style={{ alignItems: 'flex-start', gap: '16px' }}>
          <Space style={{ flex: 1 }} direction="vertical">
            <TYPE.main>输入函数</TYPE.main>

            <AutoComplete
              value={funcInput}
              options={options}
              style={{ width: '100%' }}
              onSelect={onSelect}
              // onSearch={onSearch}
              onSearch={onSearchDebounced}
              onChange={onChange}
              placeholder="function balanceOf (address account) external view returns(uint256)"
            />

            {/* <Input value={funcInput} onChange={(e) => setFuncInput(e.target?.value)} /> */}
          </Space>
          <Space direction="vertical">
            <MyButtonPrimary onClick={onSelectHandler}>添加</MyButtonPrimary>
          </Space>
          <SelectedFuncWrapper>
            {selectedFuncs &&
              selectedFuncs.map((item, index) => {
                return (
                  <SelectedFuncItem
                    key={index}
                    id={item?.id}
                    {...item}
                    onDelete={(id) => {
                      if (!id) return

                      setSelectedFuncs((prev) => {
                        if (!prev) return prev

                        // delete prev[index]

                        // return [...prev]
                        return prev.filter((item) => item.id !== id)
                      })
                    }}
                  />
                )
              })}
          </SelectedFuncWrapper>
        </Row>
      </MyCard>

      <MyCard>
        <Row style={{ gap: '32px', alignItems: 'flex-start' }}>
          <Column style={{ width: '100%', gap: '8px' }}>
            <Row style={{ flex: 1, gap: '8px' }}>
              <MyButtonPrimary onClick={onCreateContractHandler}>合约地址</MyButtonPrimary>
              <Input
                value={addressInput}
                onChange={(e) => setAddressInput(e.target?.value)}
                style={{ width: '100%' }}
              />
            </Row>

            {contracts &&
              contracts.map((item: ContractItem, index) => {
                const { address, funcs, contract } = item
                const key = index + 1 + ''

                return (
                  <Collapse
                    // activeKey={activeKey}
                    key={key}
                    // onChange={(keys) => {
                    //   console.log('[]:', activeKey, key)
                    //   setActiveKey(key)
                    // }}
                  >
                    <Collapse.Panel
                      header={
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                          <TYPE.main color="text0">{address}</TYPE.main>
                          <CloseSquareOutlined
                            onClick={(e) => {
                              e.stopPropagation()

                              setContracts((prev) => {
                                if (!prev) return prev

                                prev.splice(index, 1)
                                return [...prev]
                              })
                            }}
                          />
                        </Space>
                      }
                      key="1"
                    >
                      {funcs && (
                        <Space direction="vertical" style={{ width: '100%' }}>
                          {funcs.map((item, index) => {
                            const { name, param, type } = item

                            return (
                              <FunctionItem
                                name={name}
                                param={param}
                                type={type}
                                key={index}
                                onClick={(values) => onFuncCallHandler(item, contract, values)}
                              />
                            )
                          })}
                        </Space>
                      )}
                    </Collapse.Panel>
                  </Collapse>
                )
              })}
          </Column>

          <StatusWrapper ref={statusRef}>
            {statusList &&
              statusList.map((item, index) => {
                const { date, content } = item

                return <Status date={date} content={content} key={index} />
              })}
          </StatusWrapper>
        </Row>
      </MyCard>
    </Wrapper>
  )
}
