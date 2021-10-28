/*
 * @Author: zhangyang
 * @Date: 2021-09-01 17:36:01
 * @LastEditTime: 2021-09-01 18:00:07
 * @LastEditors: zhangyang
 * @Description:
 *
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { changeLanguagehandler } from '@/i18n'
import PageTopInfo from './PageTopInfo'
import img1 from '../assets/images/publicImg/img1.png'
import CollapseComponent from './CollapseComponent'
import { collapseTypes } from '@/constants/collapseType'
import FilterDatasComponent from './FilterDatasComponent'
export default function Index(): any {
  const { t } = useTranslation()
  const item = {
    lp_name: 'ETH-BUSD',
    apr: '24.81',
    tvl: '32.43K',
    banlance: '342.12k ETH-BUSD',
    isStake: true,
  }
  function changeTypeFn(index: number) {
    console.log('index:', index)
  }
  function inputSearchFn(value: string) {
    console.log('value:', value)
  }
  function stakedFilterFn(checked: boolean) {
    console.log('checked:', checked)
  }
  return (
    // <div
    //   style={{ color: 'red', fontSize: '30px' }}
    //   onClick={() => {
    //     changeLanguagehandler('en')
    //   }}
    // >
    //   {t('msg')}
    //   -----{t('balance') + '张三'}
    // </div>
    <>
      <PageTopInfo
        title={'聚合流动性挖矿'}
        content={'重磅上线'}
        imgUrl={img1}
        imgWidth={282}
        imgHeight={194}
        cardTitle={'锁仓量'}
        cardValue={'1,236,792,968.96'}
        isShowTitleInfo={true}
      ></PageTopInfo>
      <FilterDatasComponent
        stakedFilterFn={stakedFilterFn}
        changeTypeFn={changeTypeFn}
        inputSearchFn={inputSearchFn}
      ></FilterDatasComponent>
      {/* <CollapseComponent item={item} type={collapseTypes.singleCoin}></CollapseComponent> */}
    </>
  )
}
