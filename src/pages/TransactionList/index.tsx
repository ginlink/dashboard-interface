import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { Table } from 'antd'
import { getTransctionList, addTx, TxPropsApi, updateTxById, getTxById } from '@/services/api'
import { Modal, Button, Pagination } from 'antd'
import {
  APPROVENUM,
  OWNERARR,
  TransactionSubmitProps,
  TXSTATE,
  TYPESTATE,
  useSignatureBytes,
  useTransacitonSubmitData,
} from './hooks'
import { message } from 'antd'
import CreateTransactionModal, { CallType, MethodParams, TransferParams } from './CreateTransactionModal'
import { ButtonPrimary } from '@/components/Button'
import TableRowModal from './TableRowModal'
import {
  getSigner,
  useSafeProxy,
  useTokenContract,
  useTransactionMultiSend,
  useTransactionProxy,
} from '@/hooks/useContract'
import { useActiveWeb3React } from '@/hooks/web3'
import fu from '@/assets/images/fu.png'
import copy from 'copy-to-clipboard'
import { txType } from '@/constants/txType'
import TxStatus from './TxStatus'
import { TRANSACTION_MULTISEND_ADDRESS, TRANSACTION_PROXY_ADDRESS } from '@/constants/addresses'
import { Contract } from '@ethersproject/contracts'
import { bundleCallData, getExecByteData } from './util'
import { buildContractCall, executeTx, SafeSignature, SafeTransaction } from '@/utils/execution'
import BigFloatNumber from 'bignumber.js'
import { useSingleCallResult } from '@/state/multicall/hooks'
import { buildMultiSendSafeTx } from '@/utils/multisend'
import { safeSignTypedData } from '@/utils'

const processingData = function (hash: string) {
  if (hash) {
    const hideStr = hash.substring(4, hash.length - 4)
    return hash.replace(hideStr, '....')
  } else {
    return ''
  }
}

const conversionType = function (type: string) {
  if (Number(type) == txType.METHOD) {
    return '方法'
  } else {
    return '转账'
  }
}

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    width: 120,
  },
  {
    title: '方法',
    dataIndex: 'tx_fun',
    key: 'tx_fun',
    width: 200,
  },
  {
    title: '事务ID',
    dataIndex: 'tx_id',
    key: 'tx_id',
    width: 120,
  },
  {
    title: '事务状态',
    dataIndex: 'tx_state',
    key: 'tx_state',
    width: 120,
    render: (text: string, record: TxPropsApi) => <TxStatus text={text} record={record}></TxStatus>,
  },
  {
    title: '事务类型',
    dataIndex: 'tx_type',
    key: 'tx_type',
    width: 120,
    render: (text: any) => conversionType(text),
  },
  {
    title: 'from',
    dataIndex: 'tx_from',
    key: 'tx_from',
    width: 150,
    render: (text: any) => (
      <div>
        {processingData(text)}
        {text && (
          <img
            className="copy-icon"
            onClick={(e) => {
              e.stopPropagation()
              copy(text)
              message.success('Copy Success!')
            }}
            src={fu}
            alt=""
          />
        )}
      </div>
    ),
  },
  {
    title: 'to',
    dataIndex: 'tx_to',
    key: 'tx_to',
    width: 150,
    render: (text: any) => (
      <div>
        {processingData(text)}
        {text && (
          <img
            className="copy-icon"
            onClick={(e) => {
              e.stopPropagation()
              copy(text)
              message.success('Copy Success!')
            }}
            src={fu}
            alt=""
          />
        )}
      </div>
    ),
  },
  {
    title: '数量',
    dataIndex: 'tx_amount',
    key: 'tx_amount',
    width: 300,
  },
]

const Wrapper = styled.div`
  .ant-table-row {
    cursor: pointer;
  }
  .copy-icon {
    cursor: pointer;
    width: 16px;
    height: 16px;
    margin-left: 8px;
  }
`

const CreateButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
`

const BtnBox = styled.div`
  display: flex;
  margin-bottom: 26px;
  justify-content: space-between;
  align-items: center;
  button {
    margin-left: 14px;
  }
`

const AddressBox = styled.div``

export default function TransactionList() {
  const { chainId } = useActiveWeb3React()

  const [dataList, setDataList] = useState<any>([])
  const [rowData, setRowData] = useState<any>({})

  const [openRow, setOpenRow] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // const [tokenAddress, setTokenAddress] = useState<string | undefined>('0x5B8698f10555F5Fb4fE58BFfc2169790e526D8AD')
  // const [toAddress, setToAddress] = useState<string | undefined>('0xBf992941F09310b53A9F3436b0F40B25bCcc2C33')

  const [tokenAddress, setTokenAddress] = useState<string | undefined>()

  const [decimals, setDecimals] = useState<number | undefined>(undefined)

  const [contract, setContract] = useState<Contract | undefined>(undefined)

  const [callType, setCallType] = useState(CallType.TRANSFER)

  // const [nonce, setNonce] = useState<number | undefined>(undefined)

  const { library, account } = useActiveWeb3React()

  const [signatures, setSignatures] = useState<SafeSignature[]>([])
  const [safeTx, setSafeTx] = useState<SafeTransaction | undefined>(undefined)

  const safeProxy = useSafeProxy()
  const multiSend = useTransactionMultiSend()
  const tokenContract = useTokenContract(tokenAddress)

  const { result } = useSingleCallResult(safeProxy, 'nonce')

  const nonce = useMemo(() => {
    if (!result) return
    return result[0].toNumber()
  }, [result])

  // get table list
  useEffect(() => {
    getTransctionList().then((res) => {
      console.log('[](res):', res)
      setDataList(res)
    })
  }, [])

  // get decimals
  useEffect(() => {
    if (!tokenContract) return

    tokenContract.decimals().then((res) => {
      setDecimals(res)
    })
  }, [tokenContract])

  //初始化start
  const getDataLists = useCallback(async () => {
    // if (!safeProxy) {
    //   setDataList([])
    //   return
    // }
    // if (!nonce) {
    //   setDataList([])
    //   return
    // }
    // const res = await getTransctionList()
    //事务状态处理
    // res.map((item: any) => {
    //   const promiseArr: Array<any> = []
    //   OWNERARR.map((v: string) => {
    //     promiseArr.push(safeProxy?.approvedHashes(v, item.tx_hash))
    //   })
    //   let count = 0
    //   Promise.all(promiseArr).then((res) => {
    //     console.log('res:', res, nonce)
    //     res.map((v) => {
    //       if (v.toNumber()) count += 1
    //     })
    //   })
    //   if (count >= APPROVENUM && nonce > Number(item.tx_id)) {
    //     item.tx_state = TXSTATE.COMPLETED
    //   } else if (count >= 0 && nonce == Number(item.tx_id)) {
    //     item.tx_state = TXSTATE.HAVEINHAND
    //   } else {
    //     item.tx_state = TXSTATE.INVALID
    //   }
    // })
    // setDataList(res)
  }, [nonce, safeProxy])

  useEffect(() => {
    getDataLists()
  }, [getDataLists])
  //初始化end

  // get nonce
  // useEffect(() => {
  //   if (!safeProxy) return

  //   // nonce不会很大，用toNumber
  //   safeProxy.nonce().then((res) => setNonce(res.toNumber()))
  // }, [safeProxy])

  const resetDataList = useCallback(async () => {
    const list = await getTransctionList()

    // refresh
    setDataList(list)
  }, [])

  // const onCreateFinishedHandler = useCallback(
  //   async (values: TransferParams & MethodParams) => {
  //     console.log('[](values):', values, callType)

  //     debugger
  //     if (!chainId || !nonce || !safeProxy) return

  //     const safeAddress = TRANSACTION_PROXY_ADDRESS[chainId]

  //     // bundle data
  //     let [safeTx, safeApproveHash]: [SafeTransaction | undefined, string | undefined] = [undefined, undefined]

  //     let txFunArg: any[] = []
  //     let method = ''

  //     if (callType === CallType.TRANSFER) {
  //       const { fromAddress, toAddress, amount } = values

  //       if (!fromAddress || !toAddress || !amount) return

  //       if (!decimals) return

  //       const bigAmount = new BigFloatNumber(amount).multipliedBy(new BigFloatNumber(10).pow(decimals))

  //       const params = [toAddress, bigAmount.toFixed()]
  //       txFunArg = params
  //       method = 'transfer'

  //       if (!tokenContract) return

  //       debugger

  //       try {
  //         ;[safeTx, safeApproveHash] = bundleCallData({
  //           type: callType,
  //           contract: tokenContract,
  //           multiSendContract,
  //           safe: safeProxy,
  //           method,
  //           params,
  //           nonce,
  //           chainId,
  //         })
  //       } catch (err: any) {
  //         // message.error(JSON.stringify(err))

  //         message.error(err?.message)
  //       }
  //     } else {
  //       const { funcParams, arg } = values

  //       if (!funcParams) return

  //       method = funcParams.slice(0, funcParams.indexOf('('))

  //       const params = arg?.split(',')

  //       // transferOwnership()

  //       txFunArg = params ? params : []

  //       if (!contract) return

  //       try {
  //         ;[safeTx, safeApproveHash] = bundleCallData({
  //           type: callType,
  //           contract,
  //           multiSendContract,
  //           safe: safeProxy,
  //           method,
  //           params,
  //           nonce,
  //           chainId,
  //         })
  //       } catch (err: any) {
  //         // message.error(JSON.stringify(err))
  //         message.error(err?.message)
  //       }
  //     }

  //     if (!safeTx || !safeApproveHash) return

  //     // bundle api data
  //     const addParam = {
  //       txType: callType,
  //       txId: nonce,
  //       txFrom: '',
  //       txTo: '',
  //       txAmount: '',
  //       txHash: safeApproveHash,
  //       txFunArg: txFunArg.join(','),
  //       txData: safeTx.data,
  //       txProaddr: safeAddress,
  //       txFun: '',
  //     }

  //     if (callType === CallType.TRANSFER) {
  //       addParam.txAmount = txFunArg?.[1]?.toString()
  //       addParam.txHash = safeApproveHash
  //       addParam.txFun = 'transfer'
  //       addParam.txFrom = tokenAddress || ''
  //     } else {
  //       addParam.txFun = method
  //       addParam.txFrom = contract?.address || ''
  //     }

  //     // transaction
  //     try {
  //       debugger
  //       await safeProxy.approveHash(safeApproveHash)

  //       getDataLists()

  //       setTokenAddress('')
  //       setContract(undefined)
  //       setIsOpen(false)
  //     } catch (err) {
  //       console.log('[onCreateHandler](err):', err)
  //     }
  //   },
  //   [
  //     callType,
  //     chainId,
  //     nonce,
  //     safeProxy,
  //     decimals,
  //     tokenContract,
  //     multiSendContract,
  //     contract,
  //     tokenAddress,
  //     getDataLists,
  //   ]
  // )

  const onCreateFinishedHandler = useCallback(
    async (values: TransferParams & MethodParams) => {
      const { fromAddress, toAddress, amount, contractName, funcParams, arg } = values

      if (!multiSend || !safeProxy) return

      const nonce = (await safeProxy.nonce())?.toNumber()

      // const tx0 = buildContractCall(simpleState, 'updateNum', ['1'], nonce)

      // const tx1 = buildContractCall(simpleState, 'updateAge', ['1'], nonce)

      let tx: SafeTransaction | undefined = undefined

      const requestParam: TxPropsApi = {
        tx_type: callType,
        tx_id: nonce,
        tx_from: '',
        tx_to: '',
        tx_amount: '',
        tx_hash: '',
        tx_fun_arg: '',
        tx_data: '',
        tx_proaddr: safeProxy.address,
        tx_fun: '',
        tx_singal: '',
      }

      if (callType === CallType.TRANSFER) {
        if (!tokenContract || !amount) return

        const decimals = await tokenContract.decimals()

        const parsedAmount = new BigFloatNumber(amount).multipliedBy(new BigFloatNumber(10).pow(decimals)).toFixed()

        tx = buildContractCall(tokenContract, 'transfer', [toAddress, parsedAmount], nonce)

        requestParam.tx_from = fromAddress
        requestParam.tx_to = toAddress
        requestParam.tx_amount = parsedAmount
        requestParam.tx_fun = 'transfer'
      } else if (callType === CallType.METHOD) {
        if (!contract || !funcParams) return

        const param = arg?.split(',')

        tx = buildContractCall(contract, funcParams, param || [], nonce)

        requestParam.tx_fun_arg = arg
        requestParam.tx_fun = funcParams
      }

      if (!library || !account) return

      if (!tx) return

      const safeTx = buildMultiSendSafeTx(multiSend, [tx], nonce)

      if (!safeTx) return

      requestParam.tx_data = JSON.stringify(safeTx)

      // send tx data to service

      debugger

      await addTx(requestParam)
      setIsOpen(false)
      getDataLists()
    },
    [account, callType, contract, getDataLists, library, multiSend, safeProxy, tokenContract]
  )

  const onApproveHandler = useCallback(
    async (item: TxPropsApi) => {
      console.log('item', item)

      const { id } = item

      debugger
      // return

      if (!library || !account) return

      if (!safeProxy) return

      if (!id) return

      const { tx_singal, tx_data }: TxPropsApi = (await getTxById(id))?.[0] || {}

      const signer = getSigner(library, account)

      const safeTx = tx_data && JSON.parse(tx_data)

      if (!safeTx) return

      const signature = await safeSignTypedData(signer, safeProxy, safeTx, chainId)

      console.log('[](safeTx):', safeTx, nonce, signature)

      // send data to service

      let signatures: SafeSignature[] | undefined = undefined

      if (tx_singal) {
        signatures = JSON.parse(tx_singal).push(signature)
      } else {
        signatures = [signature]
      }

      // const signatures = tx_singal ? JSON.parse(tx_singal).push(signature) : [signature]

      await updateTxById(id, { tx_singal: JSON.stringify(signatures) })
    },
    [account, chainId, library, nonce, safeProxy]
  )

  // const onConfirmHandler = useCallback(
  //   async (item: RowItemType) => {
  //     if (!chainId || !safeProxy) return

  //     const { tx_data } = item

  //     if (!tx_data) return

  //     // console.log('item', item)
  //     // console.log(await safeProxy?.nonce())

  //     const mutiSendAddress = TRANSACTION_MULTISEND_ADDRESS[chainId]

  //     safeProxy
  //       .execTransaction(
  //         mutiSendAddress,
  //         0,
  //         tx_data,
  //         1,
  //         0,
  //         0,
  //         0,
  //         '0x0000000000000000000000000000000000000000',
  //         '0x0000000000000000000000000000000000000000',
  //         getExecByteData()
  //       )
  //       .then((res) => {
  //         console.log('res', res)
  //       })
  //       .catch((err) => {
  //         console.log('[](err):', err)
  //       })
  //   },
  //   [chainId, safeProxy]
  // )

  const onConfirmHandler = useCallback(
    async (item: TxPropsApi) => {
      const { id } = item

      if (!id) return

      if (!safeProxy) return

      const { tx_singal, tx_data }: TxPropsApi = (await getTxById(id))?.[0] || {}

      // console.log('[](safeTx):', safeTx, signatures)

      if (!tx_singal) return message.error('签名不存在')
      if (!tx_data) return message.error('数据不存在')

      const signatures: SafeSignature[] = JSON.parse(tx_singal)
      const safeTx: SafeTransaction = JSON.parse(tx_data)

      // exec
      await executeTx(safeProxy, safeTx, signatures)
    },
    [safeProxy]
  )

  const onViewRowHandler = useCallback((row: TxPropsApi) => {
    setRowData(row)

    setOpenRow(true)
    // if (row.tx_state !== TXSTATE.INVALID) {
    //   setOpenRow(true)
    // } else {
    //   message.warning('已失效')
    // }
  }, [])

  // debug
  useEffect(() => {
    console.log('[](contract):', contract)
  }, [contract])

  return (
    <Wrapper>
      <BtnBox>
        <AddressBox>代理地址：{chainId ? TRANSACTION_PROXY_ADDRESS[chainId] : ''}</AddressBox>
        <CreateButtonPrimary
          onClick={() => {
            setIsOpen(true)
          }}
        >
          创建事务
        </CreateButtonPrimary>
      </BtnBox>
      <Table
        onRow={(record) => {
          return {
            onClick: () => {
              onViewRowHandler(record)
            }, // 点击行
          }
        }}
        scroll={{ y: 700 }}
        pagination={false}
        columns={columns}
        dataSource={dataList}
      />

      <CreateTransactionModal
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        onChangeCallType={(type) => setCallType(type)}
        onChangeContract={(contract) => setContract(contract)}
        onChangeTokenAddress={(address) => setTokenAddress(address)}
        onFinished={onCreateFinishedHandler}
      ></CreateTransactionModal>

      <TableRowModal
        approveFn={onApproveHandler}
        confrimFn={onConfirmHandler}
        closeRowModal={() => setOpenRow(false)}
        openRow={openRow}
        item={rowData}
      ></TableRowModal>
      {/* 分页 */}
      {/* <Pagination
        className={'pagination-style'}
        defaultCurrent={1}
        total={20}
        showSizeChanger={false}
        onChange={changePage}
      /> */}
    </Wrapper>
  )
}
