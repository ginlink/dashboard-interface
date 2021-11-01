import React, { useState, useCallback, useMemo } from 'react'
import { Input, Space, notification } from 'antd'
import styled from 'styled-components/macro'
import { Tabs } from 'antd'
import abiDatas from '../../abis/ISpePool.json'
import { usePositionContract } from 'hooks/useContract'
import { getAddress } from 'ethers/lib/utils'

const { TabPane } = Tabs
const { Search } = Input
const Warpper = styled.div`
  width: 100%;
  padding: 20px;
  .ant-space-vertical {
    width: 32% !important;
  }
`
const TabPaneItem = styled.div`
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 6px;
`
const MethodsBox = styled.div``
const SerialNumber = styled.span`
  margin-right: 4px;
`
const MethodsName = styled.span``
const ReadInfo = styled.div``
const InputData = styled.div``
const QueryBtn = styled.div<{ isInPutOrOutPut?: boolean }>`
  cursor: pointer;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 2px 8px;
  border-radius: 4px;
  width: max-content;
  margin-bottom: ${({ isInPutOrOutPut }) => isInPutOrOutPut && '4px'};
  margin-top: ${({ isInPutOrOutPut }) => isInPutOrOutPut && '4px'};
`
const OutputData = styled.div`
  padding: 8px;
  display: none;
`
const ItemTitle = styled.div`
  width: 100%;
  padding: 8px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 6px;
`
const InputItem = styled.div`
  padding: 0 8px;
  margin-bottom: 4px;
`
const InputTitle = styled.div`
  margin-bottom: 4px;
`
const QueryTip = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
`
const QueryAddress = styled.div`
  margin-right: 10px;
`
const QueryBox = styled.div``
export default function TestComponent() {
  const [isSearch, setIsSearch] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<any>('')
  const contract = usePositionContract(searchValue)
  const abis = abiDatas.filter((v) => v.type === 'function')
  const filterAbis = useMemo(() => {
    if (!isSearch) {
      return [[], []]
    } else {
      const readData = [] as any
      const writeData = [] as any
      abis.map((v: any) => {
        if (v.stateMutability === 'view') {
          readData.push(v)
        } else {
          writeData.push(v)
        }
      })
      return [readData, writeData]
    }
  }, [abis, isSearch])
  const onSearch = useCallback(
    (value: any) => {
      console.log('value', value)
      setSearchValue(value)
      setIsSearch(false)
      try {
        const check = getAddress(value)
        console.log('check', check)
        setIsSearch(true)
        abis.map((v: any) => {
          v.outputs.map((outputItem: any) => {
            if (outputItem.node) {
              outputItem.node.style.display = 'none'
            }
          })
        })
      } catch (error) {
        console.log('error', error)
        notification['error']({
          message: '错误信息',
          description: '地址错误，请检查地址',
        })
      }
    },
    [abis]
  )
  const clickQuery = useCallback(
    async (item, bool = false, index) => {
      if (!contract) {
        notification['error']({
          message: '错误信息',
          description: '地址错误，请检查地址',
        })
        return
      }
      if (bool) {
        const queryArr = item.inputs.map((v: any) => v.node.state.value)
        console.log('queryArr', queryArr)
        // const queryArr = ['0x55d398326f99059fF775485246999027B3197955']
        const findIndex = queryArr.findIndex((v: any) => v === '' || v === undefined)
        if (findIndex != -1) {
          return
        }
        try {
          console.log('item.name', item.name)
          const res = await contract[item.name].apply(null, queryArr)
          console.log('res:', res)
          if (res.hash) {
            notification['success']({
              message: '操作成功',
              description: res.hash,
            })
          }
          if (item.outputs.length > 1) {
            item.outputs.map((v: any, flag: number) => {
              v.node.innerHTML = v.name + '(' + v.internalType + ')' + ': ' + res[flag]
              v.node.style.display = 'block'
            })
          } else {
            item.outputs.map((v: any) => {
              v.node.innerHTML = res + '<i style="color:#6c757d;margin-left:4px;">' + v.internalType + '</i>'
              v.node.style.display = 'block'
            })
          }
        } catch (err: any) {
          notification['error']({
            message: '错误信息',
            description: err?.message ? err?.message : err?.toString(),
          })
        }
      } else {
        try {
          const res = await contract[item.name]()
          console.log('res:', res)
          if (item.outputs.length > 1) {
            item.outputs.map((v: any, flag: number) => {
              v.node.innerHTML = v.name + '(' + v.internalType + ')' + ': ' + res[flag]
              v.node.style.display = 'block'
            })
          } else {
            item.outputs.map((v: any) => {
              v.node.innerHTML = res + '<i style="color:#6c757d;margin-left:4px;">' + v.internalType + '</i>'
              v.node.style.display = 'block'
            })
          }
        } catch (err: any) {
          notification['error']({
            message: '错误信息',
            description: err.toString(),
          })
        }
      }
    },
    [contract]
  )

  const getPlaceHolder = useCallback((item) => {
    return item.name + '(' + item.internalType + ')'
  }, [])
  return (
    <Warpper>
      <Space direction="vertical">
        <Search placeholder="poolAddress" allowClear enterButton="Search" size="middle" onSearch={onSearch} />
      </Space>
      <MethodsBox>
        <Tabs defaultActiveKey="0" size="middle" style={{ marginBottom: 32 }}>
          <TabPane tab="Read" key="1">
            {filterAbis[0] &&
              filterAbis[0].map((item: any, index: number) => {
                return (
                  <TabPaneItem key={index}>
                    <ItemTitle>
                      <SerialNumber>{index + 1}.</SerialNumber>
                      <MethodsName>{item.name}</MethodsName>
                    </ItemTitle>
                    <ReadInfo>
                      {item.inputs.length ? (
                        <InputData>
                          {item.inputs.map((v: any, flag: number) => {
                            return (
                              <InputItem key={flag}>
                                <InputTitle>
                                  {v.name}({v.internalType})
                                </InputTitle>
                                <Input placeholder={getPlaceHolder(v)} ref={(node) => (v.node = node)} />
                                {flag === item.inputs.length - 1 && (
                                  <QueryBtn onClick={() => clickQuery(item, true, index)} isInPutOrOutPut={true}>
                                    Query
                                  </QueryBtn>
                                )}
                              </InputItem>
                            )
                          })}
                        </InputData>
                      ) : (
                        <QueryBox>
                          <QueryTip>
                            {/* <QueryAddress>{searchValue}</QueryAddress> */}
                            <QueryBtn onClick={() => clickQuery(item, false, index)}>Query</QueryBtn>
                          </QueryTip>
                        </QueryBox>
                      )}
                      {item.outputs.map((outPutItem: any, outPutIndex: number) => {
                        return <OutputData ref={(node) => (outPutItem.node = node)} key={outPutIndex}></OutputData>
                      })}
                    </ReadInfo>
                  </TabPaneItem>
                )
              })}
          </TabPane>
          <TabPane tab="Write" key="2">
            {filterAbis[1] &&
              filterAbis[1].map((item: any, index: number) => {
                return (
                  <TabPaneItem key={index}>
                    <ItemTitle>
                      <SerialNumber>{index + 1}.</SerialNumber>
                      <MethodsName>{item.name}</MethodsName>
                    </ItemTitle>
                    {item.inputs.length && (
                      <InputData>
                        {item.inputs.map((v: any, flag: number) => {
                          return (
                            <InputItem key={flag}>
                              <InputTitle>
                                {v.name}({v.internalType})
                              </InputTitle>
                              <Input placeholder={getPlaceHolder(v)} ref={(node) => (v.node = node)} />
                              {flag === item.inputs.length - 1 && (
                                <QueryBtn onClick={() => clickQuery(item, true, index)} isInPutOrOutPut={true}>
                                  Write
                                </QueryBtn>
                              )}
                            </InputItem>
                          )
                        })}
                      </InputData>
                    )}
                    <OutputData>输出参数显示位置</OutputData>
                  </TabPaneItem>
                )
              })}
          </TabPane>
        </Tabs>
      </MethodsBox>
    </Warpper>
  )
}
