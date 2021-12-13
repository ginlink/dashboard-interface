import React, { useCallback, useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import Home from './Home'
import Tables from './Tables'
import MultiSign from './MultiSign'
import TransactionList from './TransactionList'
import CreationProcess from './MultiSign/CreationProcess'
import FastCall from './FastCall'
import CallAdmin from './CallAdmin'
import { useSingleCallResult } from '@/state/multicall/hooks'
import { useActiveWeb3React } from '@/hooks/web3'
import {
  useMulticallContract,
  useSafeFactory,
  useSafeProxy,
  useSimpleState,
  useSwapMing,
  useTokenContract,
  useTransactionMultiSend,
  useTransactionProxy,
} from '@/hooks/useContract'
import { useTransactionAdder } from '@/state/transactions/hooks'
import { getSigner, safeSignTypedData } from '@/utils'
import {
  buildContractCall,
  buildSafeTransaction,
  buildSignatureBytes,
  calculateSafeTransactionHash,
  executeTx,
  preimageSafeTransactionHash,
  SafeSignature,
  SafeTransaction,
} from '@/utils/execution'
import { bundleCallData, getExecByteData } from './TransactionList/util'
import { CallType } from './TransactionList/CreateTransactionModal'
import { SPC_ADDRESS } from '@/constants/token'
import { buildMultiSendSafeTx } from '@/utils/multisend'
import { ButtonPrimary } from '@/components/Button'
import { Card, Space } from 'antd'
import { Contract, Signature, utils } from 'ethers'
import CtAddress from './CtAddress'

function bundleSafeTransactionData({
  contract,
  multiSend,
  safe,
  method,
  params,
  nonce,
  chainId,
  delegateCall = true,
}: {
  contract?: any
  safe?: Contract
  multiSend?: Contract
  method?: string
  params?: string[]
  nonce?: number
  chainId?: number | undefined
  delegateCall?: boolean
}): [SafeTransaction | undefined, Uint8Array | undefined] {
  if (nonce === undefined) return [undefined, undefined]

  if (!contract || !safe || !method || !params || !chainId) return [undefined, undefined]

  let tx: SafeTransaction | undefined = undefined

  if (delegateCall) {
    if (!multiSend) return [undefined, undefined]

    const txs: SafeTransaction[] | undefined = [buildContractCall(contract, method, params, nonce, true)]

    tx = buildMultiSendSafeTx(multiSend, txs, nonce)
  } else {
    tx = buildContractCall(contract, method, params, nonce, false)
  }

  if (!tx) return [undefined, undefined]

  const safeApproveHash = utils.arrayify(calculateSafeTransactionHash(safe, tx, chainId))

  return [tx, safeApproveHash]
}

function buildSingerData(ownerBty32: SafeSignature[]) {
  return buildSignatureBytes(ownerBty32)
}

export default function App() {
  const { account, library, chainId } = useActiveWeb3React()
  const tokenContract = useTokenContract('0x5B8698f10555F5Fb4fE58BFfc2169790e526D8AD')

  // const inputs = useMemo(() => {
  //   if (!account) return []

  //   return [account]
  // }, [account])

  // const result = useSingleCallResult(tokenContract, 'balanceOf', inputs)

  //   console.log('[](result):', result)
  // }, [result])

  const addTransaction = useTransactionAdder()

  // const inputs = useMemo(() => {
  //   return ['0x5B8698f10555F5Fb4fE58BFfc2169790e526D8AD', '10000']
  // }, [])

  // const result = useSingleCallResult(tokenContract, 'approve', inputs)

  // useEffect(() => {
  //   if (!tokenContract || !addTransaction) return

  //   tokenContract.approve('0x5B8698f10555F5Fb4fE58BFfc2169790e526D8AD', '10000').then((res) => addTransaction(res))
  // }, [addTransaction, tokenContract])

  const transactionProxy = useTransactionProxy()

  // useEffect(() => {
  //   if (!library || !account || !transactionProxy) return

  //   const singer = getSigner(library, account)

  //   const safeTx: SafeTransaction = {
  //     baseGas: 0,
  //     data: '0x8d80ff0a00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000099005b8698f10555f5fb4fe58bffc2169790e526d8ad00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000bf992941f09310b53a9f3436b0f40b25bccc2c330000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000',
  //     gasPrice: 0,
  //     gasToken: '"0x0000000000000000000000000000000000000000"',
  //     nonce: 2,
  //     operation: 1,
  //     refundReceiver: '"0x0000000000000000000000000000000000000000"',
  //     safeTxGas: 0,
  //     to: '0xdEF572641Fac47F770596357bfb7432F78407ab3',
  //     value: 0,
  //   }

  //   safeSignTypedData(singer, transactionProxy, safeTx)
  //     .then((res) => {
  //       console.log('[safeSignTypedData](res):', res)
  //     })
  //     .catch((err) => {
  //       console.log('[safeSignTypedData](err):', err)
  //     })
  // }, [account, library, transactionProxy])

  const safeFactory = useSafeFactory()
  const safeProxy = useSafeProxy()
  const simpleState = useSimpleState()
  const multiSend = useTransactionMultiSend()

  const [txData, setTxData] = useState<string>()
  const [tx, setTx] = useState<SafeTransaction | undefined>()
  // const [tx, setTx] = useState<SafeTransaction | undefined>({
  //   baseGas: 0,
  //   data: '0x095ea7b30000000000000000000000005b8698f10555f5fb4fe58bffc2169790e526d8ad000000000000000000000000000000000000000000000000000000000000000a',
  //   gasPrice: 0,
  //   gasToken: '0x0000000000000000000000000000000000000000',
  //   nonce: 0,
  //   operation: 1,
  //   refundReceiver: '0x0000000000000000000000000000000000000000',
  //   safeTxGas: 0,
  //   to: '0x5B8698f10555F5Fb4fE58BFfc2169790e526D8AD',
  //   value: 0,
  // })
  const [nonce, setNonce] = useState<number>()
  const [safeSignature, setSafeSignature] = useState<SafeSignature | undefined>()

  const safeFactoryTest = useCallback(() => {
    if (!safeFactory) return
    safeFactory.callStatic.createProxy('0x94Cc815772cd9563fCF7eDcb8ce7b4484453c7Bd', '0x').then((res) => {
      console.log('[](staticAddress):', res)
    })
    safeFactory
      .createProxy('0x94Cc815772cd9563fCF7eDcb8ce7b4484453c7Bd', '0x')
      .then(async (res) => {
        console.log('[](res):', res)
        const waitRes = await res.wait()
        console.log('[](waitRes):', waitRes)
      })
      .catch((err) => {
        console.log('[](err):', err)
      })
    safeFactory.callStatic
      .createProxy('0x94Cc815772cd9563fCF7eDcb8ce7b4484453c7Bd', '0x')
      .then((res) => {
        console.log('[](res):', res)
      })
      .catch((err) => {
        //     console.log('[](err):', err)
      })
  }, [safeFactory])

  const onCreateProxyHandler = useCallback(async () => {
    if (!safeFactory) return

    if (!library || !account) return

    const singer = getSigner(library, account)

    const singerSafeFactory = safeFactory.connect(singer)

    // const safeProxyAddress = await safeFactory.callStatic.createProxy(
    const safeProxyAddress = await singerSafeFactory.callStatic.createProxy(
      '0x1c46f2Bf253bd9A7247830d8d7B0dd5bd040aa2F',
      '0x'
    )

    console.log('[](safeProxyAddress):', safeProxyAddress)

    // const { wait } = await safeFactory.createProxy(
    const { wait } = await singerSafeFactory.createProxy('0x1c46f2Bf253bd9A7247830d8d7B0dd5bd040aa2F', '0x')

    await wait()
  }, [account, library, safeFactory])

  const onSetupHandler = useCallback(async () => {
    if (!safeProxy || !chainId) return

    if (!library || !account) return

    const singer = getSigner(library, account)

    // setup
    const singerSafeProxy = safeProxy.connect(singer)

    // await safeProxy.setup(
    await singerSafeProxy.setup(
      ['0xBf992941F09310b53A9F3436b0F40B25bCcc2C33', '0x6E6154b3ea29a4B4d85404B4e259661eBa81Dd67'],
      // 1,
      2,
      '0x0000000000000000000000000000000000000000',
      '0x',
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
      0,
      '0x0000000000000000000000000000000000000000'
    )
  }, [account, chainId, library, safeProxy])

  const safeProxyTest = useCallback(async () => {
    if (!safeProxy || !chainId) return

    // const version = await safeProxy.VERSION()
    // const version = await safeProxy.getThreshold()
    // const version = await safeProxy.getOwners()

    // if (!tx || !safeSignature) return
    if (!tx) return

    const txHash = calculateSafeTransactionHash(safeProxy, tx, chainId)
    const txHashData = preimageSafeTransactionHash(safeProxy, tx, chainId)

    const version = await safeProxy.checkSignatures(txHash, txHashData, getExecByteData())
    // .isOwner('0xBf992941F09310b53A9F3436b0F40B25bCcc2C33')

    console.log('[](version):', version)
  }, [chainId, safeProxy, tx])

  const onApproveHandler = useCallback(async () => {
    if (!safeProxy || !chainId || !library || !account) return

    const nonce = (await safeProxy.nonce()).toNumber()
    setNonce(nonce)

    if (!multiSend) return
    const [safeTxs, safeHash] = bundleSafeTransactionData({
      contract: tokenContract,
      multiSend,
      safe: safeProxy,
      method: 'approve',
      params: ['0xBf992941F09310b53A9F3436b0F40B25bCcc2C33', '10'],
      nonce,
      chainId,
      delegateCall: true,
    })

    console.log('[](safeTxs, safeHash):', safeTxs, safeHash)

    if (!safeHash) return
    setTxData(safeTxs?.data)
    setTx(safeTxs)

    // const singer = getSigner(library, '0xBf992941F09310b53A9F3436b0F40B25bCcc2C33')
    // const singer = getSigner(library, account)

    // console.log('[](singer):', singer)
    // const singerSafe = safeProxy.connect(singer)
    // await singerSafe.approveHash(safeHash)
    await safeProxy.approveHash(safeHash)
  }, [account, chainId, library, multiSend, safeProxy, tokenContract])

  const onConfirmHandler = useCallback(async () => {
    if (!safeProxy || !chainId || !tx) return

    if (!simpleState) return
    // if (!tokenContract) return

    const txData = tx.data

    if (!txData) return

    if (!library || !account) return

    console.log('[](tx):', tx)

    const singer = getSigner(library, account)
    const singerSafeProxy = safeProxy.connect(singer)

    if (!multiSend) return

    // const execResult = await safeProxy.execTransaction(
    const execResult = await singerSafeProxy.execTransaction(
      multiSend.address,
      0,
      txData,
      1,
      0,
      0,
      0,
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
      // buildSingerData([getSigner(library, account)])
      getExecByteData()
      // buildSingerData([safeSignature])
    )

    console.log('[](execResult):', execResult)
  }, [account, chainId, library, multiSend, safeProxy, simpleState, tx])

  const onSingerHandler = useCallback(async () => {
    if (!library || !account || !safeProxy || !tx) return

    const singer = getSigner(library, account)

    const res = await safeSignTypedData(singer, safeProxy, tx)

    setSafeSignature(res)

    console.log('[safeSignTypedData](res):', res)
  }, [account, library, safeProxy, tx])

  const onSimpleStateHandler = useCallback(async () => {
    if (!safeProxy || !chainId || !library || !account) return

    const nonce = (await safeProxy.nonce()).toNumber()

    if (!simpleState) return

    if (!multiSend) return
    const [safeTxs, safeHash] = bundleSafeTransactionData({
      contract: simpleState,
      multiSend,
      safe: safeProxy,
      method: 'updateNum',
      params: ['23'],
      nonce,
      chainId,
      delegateCall: true,
    })

    console.log('[](safeTxs, safeHash):', safeTxs, safeHash)

    if (!safeHash) return
    setTxData(safeTxs?.data)
    setTx(safeTxs)
    await safeProxy.approveHash(safeHash)
  }, [account, chainId, library, multiSend, safeProxy, simpleState])

  const onMultiSendTransferHandler = useCallback(async () => {
    if (!multiSend || !safeProxy) return

    if (!tokenContract) return

    const nonce = (await safeProxy.nonce())?.toNumber()

    const tx = buildContractCall(
      tokenContract,
      'transfer',
      ['0xBf992941F09310b53A9F3436b0F40B25bCcc2C33', '100000000000000000'],
      nonce
    )

    if (!library || !account) return

    const signer = getSigner(library, account)

    const safeTx = buildMultiSendSafeTx(multiSend, [tx], nonce)
    const signature = await safeSignTypedData(signer, safeProxy, safeTx, chainId)

    console.log('[](safeTx):', safeTx, nonce, signature)

    //exec
    await executeTx(safeProxy, safeTx, [signature])
  }, [account, chainId, library, multiSend, safeProxy, tokenContract])

  const [signatures, setSignatures] = useState<SafeSignature[]>([])
  const [safeTx, setSafeTx] = useState<SafeTransaction | undefined>(undefined)

  const onMultiSendUpdateNumHandler = useCallback(async () => {
    if (!safeProxy || !safeTx) return

    console.log('[](safeTx):', safeTx, signatures)

    // exec
    await executeTx(safeProxy, safeTx, signatures)
  }, [safeProxy, safeTx, signatures])

  const onMultiSendUpdateNumSignatureHandler = useCallback(async () => {
    if (!multiSend || !safeProxy) return

    if (!simpleState) return

    const nonce = (await safeProxy.nonce())?.toNumber()

    const tx0 = buildContractCall(simpleState, 'updateNum', ['1'], nonce)

    const tx1 = buildContractCall(simpleState, 'updateAge', ['1'], nonce)

    if (!library || !account) return

    const signer = getSigner(library, account)

    const safeTx = buildMultiSendSafeTx(multiSend, [tx0, tx1], nonce)
    const signature = await safeSignTypedData(signer, safeProxy, safeTx, chainId)

    console.log('[](safeTx):', safeTx, nonce, signature)

    // send data to service

    setSignatures((prev) => {
      return [...prev, signature]
    })
    setSafeTx(safeTx)
  }, [account, chainId, library, multiSend, safeProxy, simpleState])

  const swapMing = useSwapMing()
  const onSwapMingHandler = useCallback(async () => {
    if (!swapMing) return

    const result = await swapMing.owner()

    console.log('[](owner):', result)
  }, [swapMing])

  //debug
  useEffect(() => {
    console.log('[](nonce):', nonce)
  }, [nonce])

  return (
    <>
      {/* <Card>
        <Space>
          <ButtonPrimary onClick={onCreateProxyHandler}>create proxy</ButtonPrimary>
          <ButtonPrimary onClick={onSetupHandler}>setup</ButtonPrimary>
          <ButtonPrimary onClick={onSimpleStateHandler}>更改simple_state_num</ButtonPrimary>
          <ButtonPrimary onClick={onApproveHandler}>授权</ButtonPrimary>
          <ButtonPrimary onClick={onSingerHandler}>签名</ButtonPrimary>
          <ButtonPrimary onClick={safeProxyTest}>查询授权</ButtonPrimary>
          <ButtonPrimary onClick={onMultiSendTransferHandler}>MuliSend_transfer</ButtonPrimary>
          <ButtonPrimary onClick={onMultiSendUpdateNumSignatureHandler}>MuliSend_updateNum_signature</ButtonPrimary>
          <ButtonPrimary onClick={onMultiSendUpdateNumHandler}>MuliSend_updateNum</ButtonPrimary>
          <ButtonPrimary onClick={onSwapMingHandler}>SwapMing</ButtonPrimary>
          <ButtonPrimary onClick={onConfirmHandler}>确认</ButtonPrimary>
        </Space>
      </Card> */}

      <Switch>
        <Route strict exact path="/home" component={Home} />
        <Route strict exact path="/strategy" component={Tables} />
        <Route strict exact path="/transactionList" component={TransactionList} />
        <Route strict exact path="/fast_call" component={FastCall} />
        <Route strict exact path="/call_admin" component={CallAdmin} />
        <Route strict exact path="/ct_address" component={CtAddress} />

        <Redirect from="/" to="/home" />
      </Switch>
    </>
  )
}
