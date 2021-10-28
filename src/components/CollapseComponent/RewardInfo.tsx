/*
 * @Author: your name
 * @Date: 2021-09-01 16:42:51
 * @LastEditTime: 2021-09-27 11:46:10
 * @LastEditors: jiangjin
 * @Description: In User Settings Edit
 * @FilePath: /converter-bsc-web/src/components/CollapseComponent/RewardInfo.tsx
 */
import { useRewardPoolContract } from '@/hooks/useContract'
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'
import { useActiveWeb3React } from '@/hooks/web3'
import { useSingleCallResult } from '@/store/multicall/hooks'
import { useTransactionAdder } from '@/store/transaction/hooks'
import { px2vwm } from '@/utils/adapteH5'
import { computeNumUnit } from '@/utils/formatNum'
import { eth2wei, wei2eth } from '@/utils/numConvert'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'
import { lighten } from 'polished'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import converter_logo from '../../assets/images/publicImg/converter_logo.svg'
import ButtonComponent from '../ButtonComponents'
import LoadingModel from '../OperationModel/LoadingModel'
import { TransactionErrorContent, TransactionSubmittedContent } from '../TransactionConfirmationModal'
const Box = styled.div`
  box-sizing: border-box;
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-right: 1px solid ${(props) => lighten(0.05, props.theme.black)};

  padding-right: 45px;
`
const RewardBox = styled.div`
  display: flex;
  align-items: center;
  & > img {
    width: 23px;
    height: 23px;
    margin-right: 8px;
  }
`
const ContentBox = styled.div``
const Title = styled.div`
  font-size: 9px;
  font-weight: 500;
  color: #8391a8;
`
const Value = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
`

const RewardBoxH5 = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: ${px2vwm('25px')};
    height: ${px2vwm('25px')};
  }
`

const Info = styled.div`
  display: flex;
  align-items: center;
`
interface RewardInfoInterface {
  rewardAddr: string | undefined
}
export default function RewardInfo({ rewardAddr }: RewardInfoInterface) {
  const { account } = useActiveWeb3React()
  const rewardContract = useRewardPoolContract(rewardAddr)
  const addr = useTransactionAdder()
  const [open, setOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [openSub, setOpenSub] = useState(false)
  const [hash, setHash] = useState('')
  const inputs = useMemo(() => [account ?? undefined], [account])
  const rewardResult = useSingleCallResult(rewardContract, 'earned', inputs)
  const reward: BigNumber | undefined = useMemo(() => {
    return rewardResult.result?.[0]
  }, [rewardResult.result])
  const { chainId } = useWeb3React()
  const clickBtn = useCallback(async () => {
    if (!rewardContract) return

    const rewardValue = reward?.toString()
    if (!rewardValue) return
    setOpen(true)
    console.log('[获取奖励](rewardValue):', rewardValue)

    try {
      const tx = await rewardContract.getReward()
      addr(tx)
      setOpen(false)
      setOpenSub(true)
      setHash(tx.hash)
    } catch (error) {
      setOpen(false)
      setErrorOpen(true)
      setErrorMsg((error as any).message || '')
    }
  }, [addr, reward, rewardContract])

  useEffect(() => {
    if (!account) return

    rewardContract?.balanceOf(account).then((res) => {
      console.log('[balanceOf](res):', res)
    })
  }, [account, rewardContract])

  const isWithdrawable = useMemo(() => reward?.gt(0), [reward])

  const isPc = useIsPcByScreenWidth()

  return isPc ? (
    <Box>
      <LoadingModel isOpen={open} onDismiss={() => setOpen((pre) => !pre)}></LoadingModel>
      <TransactionErrorContent isOpen={errorOpen} onDismiss={() => setErrorOpen(false)} message={errorMsg} />
      <TransactionSubmittedContent
        chainId={chainId ?? 97}
        hash={hash}
        onDismiss={() => setOpenSub((pre) => !pre)}
        isOpen={openSub}
      />
      <RewardBox>
        <img src={converter_logo} alt="" />
        <ContentBox>
          <Title>{'奖励：'}</Title>
          <Value>{computeNumUnit(wei2eth(reward))} CON</Value>
        </ContentBox>
      </RewardBox>
      <ButtonComponent clickBtn={clickBtn} btnName={'领取'} disabled={!isWithdrawable}></ButtonComponent>
    </Box>
  ) : (
    <RewardBoxH5>
      <Info>
        <img src={converter_logo} alt="" />
        <ContentBox>
          <Title>{'奖励：'}</Title>
          <Value>{computeNumUnit(wei2eth(reward))} CON</Value>
        </ContentBox>
      </Info>
      <ButtonComponent clickBtn={clickBtn} btnName={'领取'}></ButtonComponent>
    </RewardBoxH5>
  )
}
