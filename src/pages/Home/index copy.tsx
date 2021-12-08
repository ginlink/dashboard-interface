import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Input, notification } from 'antd'
import styled from 'styled-components/macro'
import { usePositionContract } from '@/hooks/useContract'
import PoolItemContentComponent from '../PoolItemContent'
// import React, { useState, useCallback, useMemo } from 'react'
// import { Input, Space, notification } from 'antd'
// import styled from 'styled-components/macro'
// import { Tabs } from 'antd'
// import abiDatas from '../../abis/ISpePool.json'
// import { usePositionContract } from 'hooks/useContract'
// import { getAddress } from 'ethers/lib/utils'

// const { TabPane } = Tabs
// const { Search } = Input
// const Warpper = styled.div`
//   width: 100%;
//   padding: 20px;
//   .ant-space-vertical {
//     width: 32% !important;
//   }
// `
// const TabPaneItem = styled.div`
//   border: 1px solid #ccc;
//   border-radius: 6px;
//   margin-bottom: 6px;
// `
// const MethodsBox = styled.div``
// const SerialNumber = styled.span`
//   margin-right: 4px;
// `
// const MethodsName = styled.span``
// const ReadInfo = styled.div``
// const InputData = styled.div``
// const QueryBtn = styled.div<{ isInPutOrOutPut?: boolean }>`
//   cursor: pointer;
//   background-color: #f8f9fa;
//   border: 1px solid #dee2e6;
//   padding: 2px 8px;
//   border-radius: 4px;
//   width: max-content;
//   margin-bottom: ${({ isInPutOrOutPut }) => isInPutOrOutPut && '4px'};
//   margin-top: ${({ isInPutOrOutPut }) => isInPutOrOutPut && '4px'};
// `
// const OutputData = styled.div`
//   padding: 8px;
//   display: none;
// `
// const ItemTitle = styled.div`
//   width: 100%;
//   padding: 8px;
//   border-bottom: 1px solid #ccc;
//   margin-bottom: 6px;
// `
// const InputItem = styled.div`
//   padding: 0 8px;
//   margin-bottom: 4px;
// `
// const InputTitle = styled.div`
//   margin-bottom: 4px;
// `
// const QueryTip = styled.div`
//   display: flex;
//   align-items: center;
//   padding: 8px;
// `
// const QueryAddress = styled.div`
//   margin-right: 10px;
// `
// const QueryBox = styled.div``
// export default function TestComponent() {
//   const [isSearch, setIsSearch] = useState<boolean>(false)
//   const [searchValue, setSearchValue] = useState<any>('')
//   const contract = usePositionContract(searchValue)
//   const abis = abiDatas.filter((v) => v.type === 'function')
//   const filterAbis = useMemo(() => {
//     if (!isSearch) {
//       return [[], []]
//     } else {
//       const readData = [] as any
//       const writeData = [] as any
//       abis.map((v: any) => {
//         if (v.stateMutability === 'view') {
//           readData.push(v)
//         } else {
//           writeData.push(v)
//         }
//       })
//       return [readData, writeData]
//     }
//   }, [abis, isSearch])
//   const onSearch = useCallback(
//     (value: any) => {
//       console.log('value', value)
//       setSearchValue(value)
//       setIsSearch(false)
//       try {
//         const check = getAddress(value)
//         console.log('check', check)
//         setIsSearch(true)
//         abis.map((v: any) => {
//           v.outputs.map((outputItem: any) => {
//             if (outputItem.node) {
//               outputItem.node.style.display = 'none'
//             }
//           })
//         })
//       } catch (error) {
//         console.log('error', error)
//         notification['error']({
//           message: '错误信息',
//           description: '地址错误，请检查地址',
//         })
//       }
//     },
//     [abis]
//   )
//   const clickQuery = useCallback(
//     async (item, bool = false, index) => {
//       if (!contract) {
//         notification['error']({
//           message: '错误信息',
//           description: '地址错误，请检查地址',
//         })
//         return
//       }
//       if (bool) {
//         const queryArr = item.inputs.map((v: any) => v.node.state.value)
//         console.log('queryArr', queryArr)
//         // const queryArr = ['0x55d398326f99059fF775485246999027B3197955']
//         const findIndex = queryArr.findIndex((v: any) => v === '' || v === undefined)
//         if (findIndex != -1) {
//           return
//         }
//         try {
//           console.log('item.name', item.name)
//           const res = await contract[item.name].apply(null, queryArr)
//           console.log('res:', res)
//           if (res.hash) {
//             notification['success']({
//               message: '操作成功',
//               description: res.hash,
//             })
//           }
//           if (item.outputs.length > 1) {
//             item.outputs.map((v: any, flag: number) => {
//               v.node.innerHTML = v.name + '(' + v.internalType + ')' + ': ' + res[flag]
//               v.node.style.display = 'block'
//             })
//           } else {
//             item.outputs.map((v: any) => {
//               v.node.innerHTML = res + '<i style="color:#6c757d;margin-left:4px;">' + v.internalType + '</i>'
//               v.node.style.display = 'block'
//             })
//           }
//         } catch (err: any) {
//           notification['error']({
//             message: '错误信息',
//             description: err?.message ? err?.message : err?.toString(),
//           })
//         }
//       } else {
//         try {
//           const res = await contract[item.name]()
//           console.log('res:', res)
//           if (item.outputs.length > 1) {
//             item.outputs.map((v: any, flag: number) => {
//               v.node.innerHTML = v.name + '(' + v.internalType + ')' + ': ' + res[flag]
//               v.node.style.display = 'block'
//             })
//           } else {
//             item.outputs.map((v: any) => {
//               v.node.innerHTML = res + '<i style="color:#6c757d;margin-left:4px;">' + v.internalType + '</i>'
//               v.node.style.display = 'block'
//             })
//           }
//         } catch (err: any) {
//           notification['error']({
//             message: '错误信息',
//             description: err.toString(),
//           })
//         }
//       }
//     },
//     [contract]
//   )

//   const getPlaceHolder = useCallback((item) => {
//     return item.name + '(' + item.internalType + ')'
//   }, [])
//   return (
//     <Warpper>
//       <Space direction="vertical">
//         <Search placeholder="poolAddress" allowClear enterButton="Search" size="middle" onSearch={onSearch} />
//       </Space>
//       <MethodsBox>
//         <Tabs defaultActiveKey="0" size="middle" style={{ marginBottom: 32 }}>
//           <TabPane tab="Read" key="1">
//             {filterAbis[0] &&
//               filterAbis[0].map((item: any, index: number) => {
//                 return (
//                   <TabPaneItem key={index}>
//                     <ItemTitle>
//                       <SerialNumber>{index + 1}.</SerialNumber>
//                       <MethodsName>{item.name}</MethodsName>
//                     </ItemTitle>
//                     <ReadInfo>
//                       {item.inputs.length ? (
//                         <InputData>
//                           {item.inputs.map((v: any, flag: number) => {
//                             return (
//                               <InputItem key={flag}>
//                                 <InputTitle>
//                                   {v.name}({v.internalType})
//                                 </InputTitle>
//                                 <Input placeholder={getPlaceHolder(v)} ref={(node) => (v.node = node)} />
//                                 {flag === item.inputs.length - 1 && (
//                                   <QueryBtn onClick={() => clickQuery(item, true, index)} isInPutOrOutPut={true}>
//                                     Query
//                                   </QueryBtn>
//                                 )}
//                               </InputItem>
//                             )
//                           })}
//                         </InputData>
//                       ) : (
//                         <QueryBox>
//                           <QueryTip>
//                             {/* <QueryAddress>{searchValue}</QueryAddress> */}
//                             <QueryBtn onClick={() => clickQuery(item, false, index)}>Query</QueryBtn>
//                           </QueryTip>
//                         </QueryBox>
//                       )}
//                       {item.outputs.map((outPutItem: any, outPutIndex: number) => {
//                         return <OutputData ref={(node) => (outPutItem.node = node)} key={outPutIndex}></OutputData>
//                       })}
//                     </ReadInfo>
//                   </TabPaneItem>
//                 )
//               })}
//           </TabPane>
//           <TabPane tab="Write" key="2">
//             {filterAbis[1] &&
//               filterAbis[1].map((item: any, index: number) => {
//                 return (
//                   <TabPaneItem key={index}>
//                     <ItemTitle>
//                       <SerialNumber>{index + 1}.</SerialNumber>
//                       <MethodsName>{item.name}</MethodsName>
//                     </ItemTitle>
//                     {item.inputs.length && (
//                       <InputData>
//                         {item.inputs.map((v: any, flag: number) => {
//                           return (
//                             <InputItem key={flag}>
//                               <InputTitle>
//                                 {v.name}({v.internalType})
//                               </InputTitle>
//                               <Input placeholder={getPlaceHolder(v)} ref={(node) => (v.node = node)} />
//                               {flag === item.inputs.length - 1 && (
//                                 <QueryBtn onClick={() => clickQuery(item, true, index)} isInPutOrOutPut={true}>
//                                   Write
//                                 </QueryBtn>
//                               )}
//                             </InputItem>
//                           )
//                         })}
//                       </InputData>
//                     )}
//                     <OutputData>输出参数显示位置</OutputData>
//                   </TabPaneItem>
//                 )
//               })}
//           </TabPane>
//         </Tabs>
//       </MethodsBox>
//     </Warpper>
//   )
// }
const Warpper = styled.div`
  color: black;
`
const poolAddressArr = [
  {
    name: 'USDC / BUSD',
    addr: '0x1845c3c9c30781f67ca1b15f9b8acdde2e0111be',
  },
  {
    name: 'USDT / BUSD',
    addr: '0x0e3fb48bbb576de6631a1f806fd5e7b7466a9931',
  },
  {
    name: 'ETH / BTCB',
    addr: '0xff7b81fe69b9b280b30c91fb1a9e9a6de85761e5',
  },
  {
    name: 'ETH / WBNB',
    addr: '0xdf09748cd0248e2db3f206e15044539058614393',
  },
  {
    name: 'BTCB / WBNB',
    addr: '0x2f649c45c62cc7fb76d4d5b8cd20a8ccac95235e',
  },
  {
    name: 'ETH / BUSD',
    addr: '0x5de4c0980bcf4f78b3912eb9ef2e3be6c61fb7e5',
  },
  {
    name: 'WBNB / BUSD',
    addr: '0x8c583754ce22ab3e7647122c01cdb854c861def9',
  },
  {
    name: 'WBNB / SPC',
    addr: '0xb140c180f40ddb3401f66bbd3788246ce8b800ea',
  },
  {
    name: 'BTCB / BUSD',
    addr: '0x197880438436c426392570cb4782432ec9135f62',
  },
  {
    name: 'Cake / WBNB',
    addr: '0xbbd4871c23eb06f0113b397c5e54d1b755903b87',
  },
]
const PoolItem = styled.div`
  margin-bottom: 20px;
`
const PoolItemHeader = styled.div`
  margin-bottom: 10px;
`
export default function Home() {
  return (
    <Warpper>
      {poolAddressArr.map((v, index) => (
        <PoolItem key={v.addr}>
          <PoolItemHeader>
            {index + 1}、{v.name}：{v.addr}
          </PoolItemHeader>
          <PoolItemContentComponent item={v}></PoolItemContentComponent>
        </PoolItem>
      ))}
    </Warpper>
  )
}
