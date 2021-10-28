import PageTopInfo from '@/components/PageTopInfo'
import React, { memo, useCallback, useState, useEffect, useMemo } from 'react'
import { CollapaseBox, FarmWarpper, HeaderBox } from './style'
import img3 from '../../assets/images/publicImg/img3.png'
import img3H5 from '../../assets/images/publicImg/img3H5.svg'
import FilterDatasComponent from '@/components/FilterDatasComponent'
import ChangeCurrency from '@/components/ChangeCurrency'
import { collapseTypes } from '@/constants/collapseType'
import EmptyShowImg from '@/components/EmptyShowImg'
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'
import ClaimModal from '@/components/ClaimModal'
import SaveModal from '@/components/SaveModal'
import { DataListBase, FarmData, getFarmList } from '@/mock'
import CollapseFather from '@/components/CollapseFather'

function Farm() {
  const [list, setList] = useState<FarmData[] | undefined>()

  // mock数据
  useEffect(() => {
    getFarmList()
      .then((result) => {
        setList(result)
      })
      .catch((err) => {
        console.log('[getFarmList](err):', err)
      })
  }, [])

  const changeTypeFn = useCallback((index: number) => {
    console.log('index:', index)
  }, [])
  const inputSearchFn = useCallback((value: string) => {
    console.log('value:', value)
  }, [])
  const stakedFilterFn = useCallback((checked: boolean) => {
    console.log('checked:', checked)
  }, [])
  const changeCurrencyFn = useCallback((index: number) => {
    console.log('index:', index)
  }, [])
  const isPc = useIsPcByScreenWidth()

  // 维护本组件状态
  const [farmSaveOpen, setFarmSaveOpen] = useState(false)
  const [farmClaimOpen, setFarmClaimOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<DataListBase | undefined>()

  const [propActiveKey, setpropActiveKey] = useState<string | undefined>()

  const changeActiveKey = useCallback((key: string[], item: DataListBase) => {
    setpropActiveKey(key.pop())

    // 用于模态框
    console.log('[changeActiveKey](item):', item)
    setCurrentItem(item)
  }, [])

  const { token0, token1, lp_pool, vault_address, reward_pool } = useMemo(() => currentItem, [currentItem]) ?? {}
  return (
    <>
      <ClaimModal
        isOpen={farmClaimOpen}
        vaultAddress={vault_address}
        address0={token0}
        address1={token1}
        addressLp={lp_pool}
        onDismiss={() => {
          setFarmClaimOpen((prev) => !prev)
        }}
      />
      <SaveModal
        isOpen={farmSaveOpen}
        vaultAddress={vault_address}
        rewardAddress={reward_pool}
        address0={token0}
        address1={token1}
        addressLp={lp_pool}
        onDismiss={() => {
          setFarmSaveOpen((prev) => !prev)
        }}
      />

      <HeaderBox>
        <PageTopInfo
          imgUrl={isPc ? img3 : img3H5}
          imgWidth={isPc ? 295 : 165}
          imgHeight={isPc ? 184 : 132}
          cardTitle={'锁仓量'}
          cardValue={'1,236,792,968.96'}
          isShowTitleInfo={false}
        ></PageTopInfo>
      </HeaderBox>
      <FarmWarpper>
        <FilterDatasComponent
          stakedFilterFn={(value) => stakedFilterFn(value)}
          changeTypeFn={(index) => changeTypeFn(index)}
          inputSearchFn={(checked) => inputSearchFn(checked)}
        ></FilterDatasComponent>
        <div className={'lineStyle'}></div>
        <ChangeCurrency
          changeCurrencyFn={changeCurrencyFn}
          currencyNames={['全部', 'Pancake', 'MDEX']}
        ></ChangeCurrency>
        <CollapaseBox>
          {list && list.length ? (
            list.map((item: DataListBase) => (
              <CollapseFather
                key={item.id}
                deposit={() => setFarmSaveOpen(true)}
                withdraw={() => setFarmClaimOpen(true)}
                changeActiveKey={changeActiveKey}
                item={item}
                propActiveKey={propActiveKey}
                type={collapseTypes.liquidityMining}
              />
            ))
          ) : (
            <EmptyShowImg></EmptyShowImg>
          )}
        </CollapaseBox>
      </FarmWarpper>
    </>
  )
}

export default memo(Farm)
