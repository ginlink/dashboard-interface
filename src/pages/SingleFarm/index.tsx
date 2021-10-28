import React, { memo, useCallback, useState, useEffect, useMemo, useRef } from 'react'
import { SingleFarmWarpper, CollapaseBox, HeaderBox } from './style'
import img2 from '../../assets/images/publicImg/img2.png'
import img2H5 from '../../assets/images/publicImg/img2H5.png'
import PageTopInfo from '@/components/PageTopInfo'
import FilterDatasComponent from '@/components/FilterDatasComponent'
import { collapseTypes } from '@/constants/collapseType'
import EmptyShowImg from '@/components/EmptyShowImg'
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'
import { Currency, CurrencyAmount, MaxUint256, Token } from 'plugins/@uniswap/sdk-core/dist'
import { TransactionErrorContent, TransactionSubmittedContent } from '@/components/TransactionConfirmationModal'
import LoadingModel from '@/components/OperationModel/LoadingModel'
import ClaimModal from '@/components/ClaimModal'
import SaveModal from '@/components/SaveModal'
import { InputToken } from '@/components/InputTokenItem'
import { VAUL_BUSD_ADDRESS, REWARD_BUSD_ADDRESS } from '@/constants/token'
import { DataListBase, FarmData, getSingleList } from '@/mock'
import CollapseFather from '@/components/CollapseFather'
import { useWeb3React } from '@web3-react/core'

function SingleFarm() {
  const [list, setList] = useState<DataListBase[] | undefined>()
  const isPc = useIsPcByScreenWidth()
  const [singleFarmClaimOpen, setSingleFarmClaimOpen] = useState(false)
  const [farmSaveOpen, setFarmSaveOpen] = useState(false)
  const [propActiveKey, setpropActiveKey] = useState<string | undefined>()
  const { chainId } = useWeb3React()
  const [currentItem, setCurrentItem] = useState<DataListBase | undefined>()

  const changeTypeFn = useCallback((index: number) => {
    console.log('index:', index)
  }, [])
  const inputSearchFn = useCallback((value: string) => {
    console.log('value:', value)
  }, [])
  const stakedFilterFn = useCallback((checked: boolean) => {
    console.log('checked:', checked)
  }, [])
  const changeActiveKey = useCallback((key: string[], item: DataListBase) => {
    setpropActiveKey(key.pop())
    setCurrentItem(item)
  }, [])

  const { token0, vault_address, reward_pool } = useMemo(() => currentItem, [currentItem]) ?? {}
  useEffect(() => {
    console.log(token0, vault_address, reward_pool, 'token0, vault_address, reward_pool')
  }, [token0, vault_address, reward_pool])
  // mock数据
  useEffect(() => {
    getSingleList()
      .then((result) => {
        console.log('[getSingleList](result)', result)
        setList(result)
      })
      .catch((err) => {
        console.log('[getSingleList](err):', err)
      })
  }, [])
  return (
    <>
      <ClaimModal
        isOpen={singleFarmClaimOpen}
        vaultAddress={vault_address}
        address0={token0}
        onDismiss={() => {
          setSingleFarmClaimOpen((prev) => !prev)
        }}
      />
      <SaveModal
        isOpen={farmSaveOpen}
        vaultAddress={vault_address}
        address0={token0}
        onDismiss={() => {
          setFarmSaveOpen((prev) => !prev)
        }}
        rewardAddress={reward_pool}
      />

      <HeaderBox>
        <PageTopInfo
          title={'羊驼单币挖矿'}
          content={'低风险 高收益'}
          imgUrl={isPc ? img2 : img2H5}
          imgWidth={isPc ? 240 : 160}
          imgHeight={isPc ? 175 : 117}
          cardTitle={'锁仓量'}
          cardValue={'1,236,792,968.96'}
          isShowTitleInfo={true}
        ></PageTopInfo>
      </HeaderBox>
      <SingleFarmWarpper>
        <FilterDatasComponent
          stakedFilterFn={(value) => stakedFilterFn(value)}
          changeTypeFn={(index) => changeTypeFn(index)}
          inputSearchFn={(checked) => inputSearchFn(checked)}
        ></FilterDatasComponent>
        <CollapaseBox>
          {list && list.length ? (
            list.map((item: DataListBase) => (
              <CollapseFather
                key={item.id}
                type={collapseTypes.singleCoin}
                deposit={() => setFarmSaveOpen(true)}
                withdraw={() => setSingleFarmClaimOpen(true)}
                changeActiveKey={changeActiveKey}
                item={item}
                propActiveKey={propActiveKey}
              />
            ))
          ) : (
            <EmptyShowImg></EmptyShowImg>
          )}
        </CollapaseBox>
      </SingleFarmWarpper>
    </>
  )
}

export default memo(SingleFarm)
