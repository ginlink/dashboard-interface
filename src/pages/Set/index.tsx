import React, { memo, useCallback, useState, useEffect, useMemo } from 'react'
import { CollapaseBox, SetWarpper, HeaderBox } from './style'
import img1 from '../../assets/images/publicImg/img1.png'
import img1H5 from '../../assets/images/publicImg/img1H5.png'
import PageTopInfo from '@/components/PageTopInfo'
import FilterDatasComponent from '@/components/FilterDatasComponent'
import ChangeCurrency from '@/components/ChangeCurrency'
import CollapseComponent from '@/components/CollapseComponent'
import { collapseTypes } from '@/constants/collapseType'
import EmptyShowImg from '@/components/EmptyShowImg'
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'
import BaseCollapse from '@/components/BaseCollapse'
import PositionHeaderCardH5 from '@/components/PositionHeaderCardH5'
import PositionContentCardH5 from '@/components/PositionContentCardH5'
import { getSetList, SetData } from '@/mock'
import CollapseFather from '@/components/CollapseFather'
import SetSaveModal from '@/components/SetSaveModal'
import SetClaimModal from '@/components/SetClaimModal'

function Set() {
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
  const [list, setList] = useState<SetData[] | undefined>()

  // mock数据
  useEffect(() => {
    getSetList()
      .then((result) => {
        setList(result)
      })
      .catch((err) => {
        console.log('[getFarmList](err):', err)
      })
  }, [])

  // 维护本组件状态
  const [saveOpen, setSaveOpen] = useState(false)
  const [claimOpen, setClaimOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<SetData | undefined>()

  const [propActiveKey, setpropActiveKey] = useState<string | undefined>()

  const changeActiveKey = useCallback((key: string[], item) => {
    setpropActiveKey(key.pop())

    // 用于模态框
    console.log('[changeActiveKey](item):', item)
    setCurrentItem(item)
  }, [])

  const { vault_address, reward_pool, token0, token1 } = useMemo(() => currentItem, [currentItem]) ?? {}

  return (
    <>
      <SetClaimModal
        isOpen={claimOpen}
        vaultAddress={vault_address}
        address0={token0}
        address1={token1}
        onDismiss={() => {
          setClaimOpen((prev) => !prev)
        }}
      />
      <SetSaveModal
        isOpen={saveOpen}
        vaultAddress={vault_address}
        rewardAddress={reward_pool}
        address0={token0}
        address1={token1}
        onDismiss={() => {
          setSaveOpen((prev) => !prev)
        }}
      />

      <HeaderBox>
        <PageTopInfo
          title={'聚合流动性挖矿'}
          content={'重磅上线'}
          imgUrl={isPc ? img1 : img1H5}
          imgWidth={isPc ? 282 : 176}
          imgHeight={isPc ? 194 : 121}
          cardTitle={'锁仓量'}
          cardValue={'1,236,792,968.96'}
          isShowTitleInfo={true}
        ></PageTopInfo>
      </HeaderBox>
      <SetWarpper>
        <FilterDatasComponent
          stakedFilterFn={(value) => stakedFilterFn(value)}
          changeTypeFn={(index) => changeTypeFn(index)}
          inputSearchFn={(checked) => inputSearchFn(checked)}
        ></FilterDatasComponent>
        <div className={'lineStyle'}></div>
        <ChangeCurrency changeCurrencyFn={changeCurrencyFn} currencyNames={['全部', 'BNB', 'ETH']}></ChangeCurrency>
        <CollapaseBox>
          {list && list.length ? (
            list.map((item: SetData) => (
              <CollapseFather
                key={item.id}
                deposit={() => setSaveOpen(true)}
                withdraw={() => setClaimOpen(true)}
                changeActiveKey={changeActiveKey}
                item={item}
                propActiveKey={propActiveKey}
                type={collapseTypes.polymerizationFluidity}
              />
            ))
          ) : (
            <EmptyShowImg></EmptyShowImg>
          )}
        </CollapaseBox>
      </SetWarpper>
    </>
  )
}

export default memo(Set)
