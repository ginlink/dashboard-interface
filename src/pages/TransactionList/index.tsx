import React, { useState, useEffect, createRef, useCallback, useRef, useMemo } from 'react'
import styled from 'styled-components/macro'
import { Table, Tag, Space } from 'antd'
import { getTransctionList, addTx } from '@/services/api'
import { Modal, Button, message } from 'antd'
import CreateTransactionModal from './CreateTransactionModal'
import { ButtonPrimary } from '@/components/Button'
import TableRowModal from './TableRowModal'
import { TransactionSubmitProps, useTransacitonSubmitData } from './hooks'
import { useTokenContract, useTransactionProxy } from '@/hooks/useContract'
import { useActiveWeb3React } from '@/hooks/web3'

import BigFloatNumber from 'bignumber.js'
const columns = [
  {
    title: '事务ID',
    dataIndex: 'tx_id',
    key: 'tx_id',
  },
  {
    title: '授权hash',
    dataIndex: 'tx_hash',
    key: 'tx_hash',
  },
  {
    title: '事务类型',
    dataIndex: 'tx_type',
    key: 'tx_type',
  },
  {
    title: 'from',
    dataIndex: 'tx_from',
    key: 'tx_from',
  },
  {
    title: 'to',
    dataIndex: 'tx_to',
    key: 'tx_to',
  },
  {
    title: '数量',
    dataIndex: 'tx_amount',
    key: 'tx_amount',
  },
  {
    title: '方法',
    dataIndex: 'tx_fun',
    key: 'tx_fun',
  },
  {
    title: '方法参数',
    dataIndex: 'tx_fun_arg',
    key: 'tx_fun_arg',
  },
]

const Wrapper = styled.div`
  .ant-table-row {
    cursor: pointer;
  }
`
const CreateButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
`
const BtnBox = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  button {
    margin-left: 14px;
  }
`
export default function TransactionList() {
  const { account, chainId } = useActiveWeb3React()

  const [dataList, setDataList] = useState<any>([])
  const [rowData, setRowData] = useState<any>({})
  const [openRow, setOpenRow] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [fromAddress, setFromAddress] = useState<string | undefined>()
  const [toAddress, setToAddress] = useState<string | undefined>()
  const [amount, setAmount] = useState<string | undefined>()
  const [address, setAddress] = useState<any>()
  const [method, setMethod] = useState<any>()
  const [arg, setArg] = useState<any>()
  const [createType, setCreateType] = useState<number>(1)

  const [decimals, setDecimals] = useState<number | undefined>(undefined)

  // const [tokenAddress, setTokenAddress] = useState<string | undefined>(undefined)

  // useEffect(() => {
  //   setTokenAddress('0x5b8698f10555f5fb4fe58bffc2169790e526d8ad')
  // }, [])

  const transactionProxy = useTransactionProxy()

  const tokenContract = useTokenContract(fromAddress)

  useEffect(() => {
    if (!tokenContract) return

    tokenContract.decimals().then((res) => {
      setDecimals(res)
    })
  }, [tokenContract])

  const Proxysinger = useTransactionProxy()

  const [nonce, setNonce] = useState<number | undefined>(undefined)
  useEffect(() => {
    if (!Proxysinger) return

    // nonce不会很大，用toNumber
    Proxysinger.nonce().then((res) => setNonce(res.toNumber()))
  }, [Proxysinger])

  const params: TransactionSubmitProps = useMemo(() => {
    if (!amount || !toAddress || !chainId || !nonce || !decimals) return {}

    const bigAmount = new BigFloatNumber(amount)
    const _amount = bigAmount.multipliedBy(new BigFloatNumber(10).pow(decimals)).toFixed()

    return {
      contract: tokenContract,
      chainId,
      method: 'transfer',
      targetAmount: [toAddress, _amount],
      nonce: nonce,
      safe: '0xa417D727268ADb2A4FE137F47bf6AA493D2fAAd5',
      fnType: createType,
    }
  }, [amount, chainId, createType, decimals, nonce, toAddress, tokenContract])

  const { safeTx, safeApproveHash } = useTransacitonSubmitData(params)

  // const { safeTx, safeApproveHash } = useTransacitonSubmitData(
  //   tokenContract,
  //   'transfer',
  //   ['0xf0a734400c8BD2e80Ba166940B904C59Dd08b6F0', '10000000000000000000'],
  //   2,
  //   '97',
  //   '0xa417D727268ADb2A4FE137F47bf6AA493D2fAAd5'
  // )

  useEffect(() => {
    getTransctionList().then((res) => {
      setDataList(res)
    })
  }, [])
  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])
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
    setAddress(e.target.value)
  }, [])
  const changeMethod = useCallback((e) => {
    setMethod(e.target.value)
  }, [])
  const changeArg = useCallback((e) => {
    setArg(e.target.value)
  }, [])
  const createFn = useCallback(async () => {
    const addParam = {
      txType: createType,
      txId: '2',
      txFrom: '',
      txTo: '',
      txAmount: '',
      txHash: '1111111',
      txFun: '',
      txFunArg: '',
      txData: '',
      txProaddr: '0xa417D727268ADb2A4FE137F47bf6AA493D2fAAd5',
    }
    if (!safeApproveHash || !safeTx || !Proxysinger) return
    if (createType === 1) {
      addParam.txFrom = '0x5b8698f10555f5fb4fe58bffc2169790e526d8ad'
      addParam.txTo = '0x0F70D0661bA51a0383f59E76dC0f2d44703A8680'
      addParam.txAmount = '100000000000000000'
      addParam.txFun = 'transfer'
      addParam.txFunArg = '0x0F70D0661bA51a0383f59E76dC0f2d44703A8680,100000000000000000'
      addParam.txHash = safeApproveHash
      addParam.txData = safeTx.data
    } else {
      addParam.txFun = method
      addParam.txFunArg = ''
    }
    debugger
    try {
      await Proxysinger.approveHash(safeApproveHash)
      const res = await addTx(addParam)
      if (res.code === 200) {
        getTransctionList().then((res) => {
          setDataList(res.data)
        })
      }
      setFromAddress('')
      setToAddress('')
      setAmount('')
      setAddress('')
      setMethod('')
      setArg('')
      setIsOpen(false)
    } catch (error) {}
  }, [Proxysinger, createType, method, safeApproveHash, safeTx])
  const onChangeCreateType = useCallback((e) => {
    setCreateType(e.target.value)
    if (e.target.value == 1) {
      setMethod('transfer')
    }
  }, [])

  const viewRow = useCallback((row) => {
    setRowData(row)
    if (!!row.tx_hash) {
      setOpenRow(true)
    } else {
      message.warning('已失效')
    }
  }, [])

  const closeRowModal = useCallback(() => {
    setOpenRow(false)
  }, [])

  const approveFn = useCallback(
    (item) => {
      console.log('item', item)

      transactionProxy?.approveHash(item.tx_hash).then((res) => {
        console.log('res', res)
      })
    },
    [transactionProxy]
  )
  const confrimFn = useCallback(
    async (item) => {
      console.log('item', item)
      console.log(await transactionProxy?.nonce())
      transactionProxy
        ?.execTransaction(
          '0xdEF572641Fac47F770596357bfb7432F78407ab3',
          0,
          item.tx_data,
          1,
          0,
          0,
          0,
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000F70D0661bA51a0383f59E76dC0f2d44703A868000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000013F0b2a9691bB72cae72616b39E798a824F182710000000000000000000000000000000000000000000000000000000000000000010000000000000000000000002D0D56a2490B942F59704481a4Eedf894CdCCec8000000000000000000000000000000000000000000000000000000000000000001'
        )
        .then((res) => {
          console.log('res', res)
        })
    },
    [transactionProxy]
  )

  return (
    <Wrapper>
      <BtnBox>
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
              viewRow(record)
            }, // 点击行
          }
        }}
        scroll={{ x: 2000, y: 700 }}
        pagination={false}
        columns={columns}
        dataSource={dataList}
      />
      <CreateTransactionModal
        onClose={onClose}
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
        createFn={createFn}
        createType={createType}
        onChangeCreateType={onChangeCreateType}
      ></CreateTransactionModal>

      <TableRowModal
        approveFn={approveFn}
        confrimFn={confrimFn}
        closeRowModal={closeRowModal}
        openRow={openRow}
        item={rowData}
      ></TableRowModal>
    </Wrapper>
  )
}
