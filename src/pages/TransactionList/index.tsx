import React, { useState, useEffect, createRef, useCallback, useRef, useMemo } from 'react'
import styled from 'styled-components/macro'
import { Table, Tag, Space } from 'antd'
import { getTransctionList, addTx } from '@/services/api'
import { Modal, Button, message } from 'antd'
import CreateTransactionModal from './CreateTransactionModal'
import { ButtonPrimary } from '@/components/Button'
import TableRowModal, { RowItemType } from './TableRowModal'
import { TransactionSubmitProps, TYPESTATE, useSignatureBytes, useTransacitonSubmitData } from './hooks'
import { useTokenContract, useTransactionProxy } from '@/hooks/useContract'
import { useActiveWeb3React } from '@/hooks/web3'
import fu from '@/assets/images/fu.png'
import copy from 'copy-to-clipboard'
import { txType } from '@/constants/txType'
import TxStatus from './TxStatus'
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

import BigFloatNumber from 'bignumber.js'
import { TRANSACTION_MULTISEND_ADDRESS, TRANSACTION_PROXY_ADDRESS } from '@/constants/address'
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
  // {
  //   title: '授权hash',
  //   dataIndex: 'tx_hash',
  //   key: 'tx_hash',
  //   render: (text: any) => processingData(text),
  // },
  {
    title: '事务状态',
    dataIndex: 'tx_id',
    key: 'tx_id',
    width: 120,
    render: (text: any) => <TxStatus text={text}></TxStatus>,
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
  // {
  //   title: '方法参数',
  //   dataIndex: 'tx_fun_arg',
  //   key: 'tx_fun_arg',
  // },
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

  // const [fromAddress, setFromAddress] = useState<string | undefined>('0x5B8698f10555F5Fb4fE58BFfc2169790e526D8AD')
  // const [toAddress, setToAddress] = useState<string | undefined>('0xBf992941F09310b53A9F3436b0F40B25bCcc2C33')

  const [fromAddress, setFromAddress] = useState<string | undefined>()
  const [toAddress, setToAddress] = useState<string | undefined>()

  const [amount, setAmount] = useState<string | undefined>()
  const [address, setAddress] = useState<any>()
  const [method, setMethod] = useState<any>()

  const [arg, setArg] = useState<any>()
  const [createType, setCreateType] = useState<number>(1)

  const [decimals, setDecimals] = useState<number | undefined>(undefined)

  const transactionProxy = useTransactionProxy()

  const tokenContract = useTokenContract(fromAddress)

  const OWNER = useMemo(
    () => [
      '0x0F70D0661bA51a0383f59E76dC0f2d44703A8680',
      '0xD06803c7cE034098CB332Af4C647f293C8BcD76a',
      '0xf0a734400c8BD2e80Ba166940B904C59Dd08b6F0',
      '0xBf992941F09310b53A9F3436b0F40B25bCcc2C33',
    ],
    []
  )

  const singerByteData = useSignatureBytes(OWNER)

  const proxySinger = useTransactionProxy()

  const [nonce, setNonce] = useState<number | undefined>(undefined)

  const submitParams: TransactionSubmitProps = useMemo(() => {
    debugger
    if (!amount || !toAddress || !chainId || nonce === undefined || !decimals) return {}

    const bigAmount = new BigFloatNumber(amount)
    const _amount = bigAmount.multipliedBy(new BigFloatNumber(10).pow(decimals)).toFixed()

    debugger

    return {
      contract: tokenContract,
      chainId,
      method: 'transfer',
      params: [toAddress, _amount],
      nonce: nonce,
      safe: TRANSACTION_PROXY_ADDRESS[chainId],
      fnType: TYPESTATE.TRANSFER,
    }
  }, [amount, chainId, decimals, nonce, toAddress, tokenContract])

  // get data for transaction
  const { safeTx, safeApproveHash } = useTransacitonSubmitData(submitParams)

  useEffect(() => {
    if (!tokenContract) return

    tokenContract.decimals().then((res) => {
      setDecimals(res)
    })
  }, [tokenContract])

  useEffect(() => {
    getTransctionList().then((res) => {
      setDataList(res)
    })
  }, [])

  useEffect(() => {
    if (!proxySinger) return

    // nonce不会很大，用toNumber
    proxySinger.nonce().then((res) => setNonce(res.toNumber()))
  }, [proxySinger])

  const changeFromAddress = useCallback((e) => {
    setFromAddress(e.target.value)
  }, [])
  const changeToAddress = useCallback((e) => {
    setToAddress(e.target.value)
  }, [])
  const changeAmount = useCallback((e) => {
    setAmount(e.target.value)
  }, [])
  const changeAddress = useCallback((e) => {
    setAddress(e)
  }, [])
  const changeMethod = useCallback((e) => {
    setMethod(e)
  }, [])
  const changeArg = useCallback((e) => {
    setArg(e.target.value)
  }, [])

  const resetInput = useCallback(() => {
    setFromAddress('')
    setToAddress('')
    setAmount('')
    setAddress('')
    setMethod('')
    setArg('')
  }, [])

  const onChangeCreateType = useCallback((e) => {
    const type = e.target.value

    if (!type) return

    setCreateType(type)

    if (type == TYPESTATE.TRANSFER) {
      setMethod('transfer')
    }
  }, [])

  const onCreateHandler = useCallback(async () => {
    const { params, nonce, safe } = submitParams

    if (nonce === undefined) return

    if (!params || !fromAddress) return

    if (!safeApproveHash || !safeTx || !proxySinger) return

    const addParam = {
      txType: createType,
      txId: nonce,
      txFrom: fromAddress,
      txTo: params[0],
      txAmount: params[1].toString(),
      txHash: safeApproveHash,
      txFunArg: params.join(','),
      txData: safeTx.data,
      txProaddr: safe,
      txFun: '',
    }

    debugger

    // for api
    if (createType === TYPESTATE.TRANSFER) {
      addParam.txFun = 'transfer'
    } else {
      addParam.txFun = method
    }

    try {
      // transaction
      await proxySinger.approveHash(safeApproveHash)

      // api
      await addTx(addParam)

      const list = await getTransctionList()

      setDataList(list)

      resetInput()
      setIsOpen(false)
    } catch (err) {
      console.log('[onCreateHandler](err):', err)
    }
  }, [submitParams, fromAddress, safeApproveHash, safeTx, proxySinger, createType, method, resetInput])

  const onApproveHandler = useCallback(
    (item) => {
      console.log('item', item)

      transactionProxy?.approveHash(item.tx_hash).then((res) => {
        console.log('res', res)
      })
    },
    [transactionProxy]
  )

  const onConfirmHandler = useCallback(
    async (item: RowItemType) => {
      if (!chainId || !transactionProxy) return
      const { tx_data } = item

      if (!tx_data) return

      // console.log('item', item)
      // console.log(await transactionProxy?.nonce())

      transactionProxy
        .execTransaction(
          TRANSACTION_MULTISEND_ADDRESS[chainId],
          0,
          tx_data,
          1,
          0,
          0,
          0,
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
          singerByteData
        )
        .then((res) => {
          console.log('res', res)
        })
        .catch((err) => {
          console.log('[](err):', err)
        })
    },
    [chainId, singerByteData, transactionProxy]
  )

  const onViewRow = useCallback((row: RowItemType) => {
    setRowData(row)

    if (!!row.tx_hash) {
      setOpenRow(true)
    } else {
      message.warning('已失效')
    }
  }, [])

  // debug
  useEffect(() => {
    console.log('[](submitParams):', submitParams)
  }, [submitParams])

  return (
    <Wrapper>
      <BtnBox>
        <AddressBox>代理地址：{TRANSACTION_PROXY_ADDRESS[chainId || 56]}</AddressBox>
        <CreateButtonPrimary
          onClick={() => {
            setCreateType(1)
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
              onViewRow(record)
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
        fromAddress={fromAddress}
        changeFromAddress={changeFromAddress}
        toAddress={toAddress}
        changeToAddress={changeToAddress}
        amount={amount}
        changeAmount={changeAmount}
        method={method}
        changeMethod={changeMethod}
        address={address}
        changeAddress={changeAddress}
        arg={arg}
        changeArg={changeArg}
        createFn={onCreateHandler}
        createType={createType}
        onChangeCreateType={onChangeCreateType}
      ></CreateTransactionModal>

      <TableRowModal
        approveFn={onApproveHandler}
        confrimFn={onConfirmHandler}
        closeRowModal={() => setOpenRow(false)}
        openRow={openRow}
        item={rowData}
      ></TableRowModal>
    </Wrapper>
  )
}
