import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { Form, Table } from 'antd'
import { getTransctionList, addTx, TxPropsApi, updateTxById, getTxById, TxStatusEnum } from 'services/api'
import { message } from 'antd'
import CreateTransactionModal, { CallType, MethodParams, TransferParams } from './CreateTransactionModal'
import { ButtonPrimary } from '@/components/Button'
import TableRowModal from './TableRowModal'
import { getSigner, useTokenContract, useTransactionMultiSend, useTransactionProxy } from '@/hooks/useContract'
import { useAccountList, useActiveWeb3React } from '@/hooks/web3'
import fu from '@/assets/images/fu.png'
import copy from 'copy-to-clipboard'
import { txType } from '@/constants/txType'
import TxStatus from './TxStatus'
import { TRANSACTION_PROXY_ADDRESS } from '@/constants/addresses'
import { Contract } from '@ethersproject/contracts'
import { isMeet, nonceAdapter, parseParam } from './util'
import { buildContractCall, executeTx, SafeSignature, SafeTransaction } from '@/utils/execution'
import BigFloatNumber from 'bignumber.js'
import { useSingleCallResult } from '@/state/multicall/hooks'
import { buildMultiSendSafeTx } from '@/utils/multisend'
import { safeSignTypedData } from '@/utils'
import { useBlockNumber } from '@/hooks/useBlockNumber'
import { useTransactionList } from '@/state/http/hooks'

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
    dataIndex: 'txFun',
    key: 'txFun',
    width: 200,
  },
  {
    title: '事务ID',
    dataIndex: 'txId',
    key: 'txId',
    width: 120,
  },
  {
    title: '事务状态',
    dataIndex: 'txStatus',
    key: 'txStatus',
    width: 120,
    render: (text: string, record: TxPropsApi) => <TxStatus text={text} record={record}></TxStatus>,
  },
  {
    title: '事务类型',
    dataIndex: 'txType',
    key: 'txType',
    width: 120,
    render: (text: any) => conversionType(text),
  },
  {
    title: 'from',
    dataIndex: 'txFrom',
    key: 'txFrom',
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
    dataIndex: 'txTo',
    key: 'txTo',
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
    dataIndex: 'txAmount',
    key: 'txAmount',
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

export type SafeProxyInfo = {
  owners?: string[]
  threshold?: number
}

const AddressBox = styled.div``

export default function TransactionList() {
  const { chainId } = useActiveWeb3React()

  const [dataList, setDataList] = useState<any>([])

  const [rowData, setRowData] = useState<any>({})

  const [openRow, setOpenRow] = useState<boolean>(false)

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [tokenAddress, setTokenAddress] = useState<string | undefined>()

  const [contract, setContract] = useState<Contract | undefined>(undefined)

  const [callType, setCallType] = useState(CallType.TRANSFER)

  const [safeProxyInfo, setSafeProxyInfo] = useState<SafeProxyInfo | undefined>(undefined)

  const [isCreating, setIsCreating] = useState(false)

  const { library, account } = useActiveWeb3React()

  const safeProxy = useTransactionProxy()
  const multiSend = useTransactionMultiSend()
  const tokenContract = useTokenContract(tokenAddress)
  const latestBlockNumber = useBlockNumber()
  useAccountList()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    console.log('safeProxy', safeProxy)
  }, [safeProxy])
  const [createTransactionForm] = Form.useForm()

  // get dynamic nonce
  const { result } = useSingleCallResult(safeProxy, 'nonce')
  console.log('result', result)
  const nonce: number | undefined = useMemo(() => {
    if (result == undefined) return

    return result[0]?.toNumber()
  }, [result])

  const [transactionList, setTransactionList] = useState<TxPropsApi[] | undefined>(undefined)

  const transactionListWithLoop = useTransactionList()

  // fresh data list
  const manualResetDataList = useCallback(async () => {
    if (nonce == undefined || !safeProxyInfo) return
    const data: TxPropsApi[] | undefined = await getTransctionList()

    data?.reverse()
    // const list = nonceAdapter({
    //   data,
    //   nonce,
    //   safeProxyInfo,
    // })
    setDataList(data)
  }, [nonce, safeProxyInfo])

  // get owners and threshold
  useEffect(() => {
    if (!safeProxy) return

    safeProxy
      .getOwners()
      .then((res) => {
        setSafeProxyInfo((prev) => {
          return {
            ...prev,
            owners: res,
          }
        })
      })
      .catch((err) => {
        console.log('[](err):', err)
      })

    safeProxy
      .getThreshold()
      .then((res) => {
        setSafeProxyInfo((prev) => {
          return {
            ...prev,
            threshold: res.toNumber(),
          }
        })
      })
      .catch((err) => {
        console.log('[](err):', err)
      })
  }, [safeProxy, latestBlockNumber])

  // init get table list
  // useEffect(() => {
  //   manualResetDataList()
  // }, [manualResetDataList])

  // init get table list
  useEffect(() => {
    if (!transactionListWithLoop || !safeProxyInfo || nonce == undefined) return

    const data = [...transactionListWithLoop]

    data.reverse()

    const list = nonceAdapter({
      data,
      nonce,
      safeProxyInfo,
    })
    setDataList(list)
  }, [nonce, safeProxyInfo, transactionListWithLoop])

  const onCreateFinishedHandler = useCallback(
    async (values: TransferParams & MethodParams) => {
      debugger

      const { fromAddress, toAddress, amount, contractName, funcName, arg } = values
      if (!multiSend || !safeProxy) return

      const simpleError = new Error('')

      setIsCreating(true)
      try {
        const nonce = (await safeProxy.nonce())?.toNumber()

        // const tx0 = buildContractCall(simpleState, 'updateNum', ['1'], nonce)

        // const tx1 = buildContractCall(simpleState, 'updateAge', ['1'], nonce)

        let tx: SafeTransaction | undefined = undefined

        const requestParam: TxPropsApi = {
          txType: callType,
          txId: nonce + '',
          txFrom: '',
          txTo: '',
          txAmount: '',
          txHash: '',
          txFunArg: '',
          txData: '',
          txProaddr: safeProxy.address,
          txFun: '',
          txSingal: '',
        }

        if (callType === CallType.TRANSFER) {
          if (!tokenContract || !amount) throw simpleError

          let decimals: number | undefined = undefined

          try {
            decimals = await tokenContract.decimals()
          } catch (err) {
            console.log('[decimals](err):', err)
            message.warning('expect token address!')
          }

          if (!decimals) throw simpleError

          const parsedAmount = new BigFloatNumber(amount).multipliedBy(new BigFloatNumber(10).pow(decimals)).toFixed()

          tx = buildContractCall(tokenContract, 'transfer', [toAddress, parsedAmount], nonce)

          debugger
          requestParam.txFrom = tokenContract.address
          requestParam.txTo = toAddress
          requestParam.txAmount = parsedAmount
          requestParam.txFun = 'transfer'
        } else if (callType === CallType.METHOD) {
          if (!contract || !funcName) throw simpleError

          // const param = arg?.split(',')
          const param = parseParam(arg)

          tx = buildContractCall(contract, funcName, param || [], nonce)

          // const funcName = funcName.indexOf('(') != -1 ? funcName.slice(0, funcName.indexOf('(')) : funcName

          requestParam.txFrom = contract.address
          requestParam.txFunArg = arg
          requestParam.txFun = funcName
        }

        if (!library || !account) throw simpleError

        if (!tx) throw simpleError

        const safeTx = buildMultiSendSafeTx(multiSend, [tx], nonce)

        if (!safeTx) throw simpleError

        requestParam.txData = JSON.stringify(safeTx)

        debugger
        // send tx data to service
        await addTx(requestParam)

        // await new Promise((resolve) => {
        //   setTimeout(() => {
        //     resolve(0)
        //   }, 2000)
        // })

        setIsOpen(false)
        createTransactionForm.resetFields()
        manualResetDataList()
      } catch (err) {
        console.log('[](err):', err)
      } finally {
        setIsCreating(false)
      }
    },
    [
      account,
      callType,
      contract,
      createTransactionForm,
      library,
      multiSend,
      manualResetDataList,
      safeProxy,
      tokenContract,
    ]
  )

  const onApproveHandler = useCallback(
    async (item: TxPropsApi) => {
      console.log('item', item)

      const { id } = item

      if (!library || !account) return

      if (!safeProxy) return

      if (!id) return

      const { txSingal, txData }: TxPropsApi = (await getTxById(id))?.[0] || {}

      const signer = getSigner(library, account)
      let safeTx: SafeTransaction | undefined = undefined
      debugger
      try {
        safeTx = txData && JSON.parse(txData)
      } catch (err) {
        console.log('[JSON](err):', err)
      }

      if (!safeTx) return

      const signature = await safeSignTypedData(signer, safeProxy, safeTx, chainId)

      console.log('[](safeTx):', safeTx, nonce, signature)

      // send data to service

      let signatures: SafeSignature[] | undefined = undefined

      if (txSingal) {
        try {
          const tmp = JSON.parse(txSingal)
          tmp.push(signature)

          signatures = tmp
        } catch (err) {
          console.log('[](err):', err)
        }
      } else {
        signatures = [signature]
      }

      await updateTxById(id, { txSingal: JSON.stringify(signatures) })
      message.success('授权成功！')
      manualResetDataList()
      setOpenRow(false)
    },
    [account, chainId, library, nonce, manualResetDataList, safeProxy]
  )

  const onConfirmHandler = useCallback(
    async (item: TxPropsApi) => {
      const { id } = item
      debugger
      if (!id) return

      if (!safeProxy) return

      const { txSingal, txData }: TxPropsApi = (await getTxById(id))?.[0] || {}

      console.log('[](txSingal):', txSingal)

      if (!txSingal) return message.error('签名不存在')
      if (!txData) return message.error('数据不存在')

      let signatures: SafeSignature[] | undefined = undefined
      let safeTx: SafeTransaction | undefined = undefined

      try {
        signatures = JSON.parse(txSingal)
        safeTx = JSON.parse(txData)
      } catch (err) {
        console.log('[JSON](err):', err)
      }

      if (!signatures || !safeTx) return message.error('[]签名或者交易hash不存在')

      // exec
      await executeTx(safeProxy, safeTx, signatures)
      message.success('执行交易已发送！')
      manualResetDataList()
      setIsOpen(false)
      setOpenRow(false)
    },
    [manualResetDataList, safeProxy]
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
    console.log('[](contract):', dataList)
  }, [dataList])

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
        form={createTransactionForm}
        isCreating={isCreating}
        onChangeCallType={(type) => setCallType(type)}
        onChangeContract={(contract) => setContract(contract)}
        onChangeTokenAddress={(address) => setTokenAddress(address)}
        onFinished={onCreateFinishedHandler}
      ></CreateTransactionModal>

      <TableRowModal
        approveFn={onApproveHandler}
        confrimFn={onConfirmHandler}
        closeRowModal={() => setOpenRow(false)}
        safeProxyInfo={safeProxyInfo}
        openRow={openRow}
        item={rowData}
        nonce={nonce}
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
