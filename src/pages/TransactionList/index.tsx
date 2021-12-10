import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components/macro'
import { Table } from 'antd'
import { getTransctionList, addTx } from '@/services/api'
import { message } from 'antd'
import CreateTransactionModal, { CallType } from './CreateTransactionModal'
import { ButtonPrimary } from '@/components/Button'
import TableRowModal, { RowItemType } from './TableRowModal'
import { useTokenContract, useTransactionMultiSend, useTransactionProxy } from '@/hooks/useContract'
import { useActiveWeb3React } from '@/hooks/web3'
import fu from '@/assets/images/fu.png'
import copy from 'copy-to-clipboard'
import { txType } from '@/constants/txType'
import TxStatus from './TxStatus'
import { TRANSACTION_MULTISEND_ADDRESS, TRANSACTION_PROXY_ADDRESS } from '@/constants/address'
import { Contract } from '@ethersproject/contracts'
import { bundleCallData, getExecByteData } from './util'

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
    dataIndex: 'tx_id',
    key: 'tx_id',
    width: 120,
    render: (text: string, record: RowItemType) => <TxStatus text={text} record={record}></TxStatus>,
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

  const [nonce, setNonce] = useState<number | undefined>(undefined)

  const transactionProxy = useTransactionProxy()

  const tokenContract = useTokenContract(tokenAddress)

  const multiSendContract = useTransactionMultiSend()

  const proxySinger = useTransactionProxy()

  // get table list
  useEffect(() => {
    getTransctionList().then((res) => {
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

  // get nonce
  useEffect(() => {
    if (!proxySinger) return

    // nonce不会很大，用toNumber
    proxySinger.nonce().then((res) => setNonce(res.toNumber()))
  }, [proxySinger])

  const resetDataList = useCallback(async () => {
    const list = await getTransctionList()

    // refresh
    setDataList(list)
  }, [])

  const onViewRow = useCallback((row: RowItemType) => {
    setRowData(row)
    setOpenRow(true)

    // if (!!row.tx_hash) {
    //   setOpenRow(true)
    // } else {
    //   message.warning('已失效')
    // }
  }, [])

  const onCreateFinishedHandler = useCallback(
    async (values: any) => {
      console.log('[](values):', values, callType)
      if (!chainId || !nonce || !proxySinger || !tokenContract || !contract) return

      const { method, params } = values

      if (!method || !params) return

      const safeAddress = TRANSACTION_PROXY_ADDRESS[chainId]

      // TODO处理amount * 10**18

      // bundle data
      const { safeTx, safeApproveHash } = bundleCallData({
        type: callType,
        contract: callType ? tokenContract : contract,
        multiSendContract,
        safeAddress,
        method,
        params,
        nonce,
        chainId,
      })

      if (!safeTx || !safeApproveHash) return

      const addParam = {
        txType: callType,
        txId: nonce,
        txFrom: '',
        txTo: '',
        txAmount: '',
        txHash: safeApproveHash,
        txFunArg: params.join(','),
        txData: safeTx.data,
        txProaddr: safeAddress,
        txFun: '',
      }

      if (callType === CallType.TRANSFER) {
        addParam.txAmount = params?.[1]?.toString()
        addParam.txHash = safeApproveHash
        addParam.txFun = 'transfer'
        addParam.txFrom = tokenAddress || ''
      } else {
        addParam.txFun = method
        addParam.txFrom = contract?.address || ''
      }

      // transaction
      try {
        await proxySinger.approveHash(safeApproveHash)

        // api
        await addTx(addParam)

        resetDataList()

        setTokenAddress('')
        setIsOpen(false)
      } catch (err) {
        console.log('[onCreateHandler](err):', err)
      }
    },
    [callType, chainId, contract, tokenAddress, multiSendContract, nonce, proxySinger, resetDataList, tokenContract]
  )

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

      const mutiSendAddress = TRANSACTION_MULTISEND_ADDRESS[chainId]

      transactionProxy
        .execTransaction(
          mutiSendAddress,
          0,
          tx_data,
          1,
          0,
          0,
          0,
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
          getExecByteData()
        )
        .then((res) => {
          console.log('res', res)
        })
        .catch((err) => {
          console.log('[](err):', err)
        })
    },
    [chainId, transactionProxy]
  )

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
        onChangeCallType={(type) => setCallType(type)}
        onChangeContract={(contract) => setContract(contract)}
        onFinished={onCreateFinishedHandler}
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
