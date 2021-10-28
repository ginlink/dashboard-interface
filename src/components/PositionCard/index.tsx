import React, { memo, useCallback } from 'react'
import { Empty, PositionCardWarpper, Title } from './style'
import ti from '../../assets/images/publicImg/icon-ti.svg'
import PositionCardItem from './PositionCardItem'
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'
import BaseCollapse from '../BaseCollapse'
import { useTheme } from 'styled-components'

interface PositionCardInterface {
  type: string
  title: string
  list: any
  tip: string
  receive: () => void
  withdraw: () => void
  deposit: () => void
}
function PositionCard({ title, list, type, tip, deposit, withdraw, receive }: PositionCardInterface) {
  const isPc = useIsPcByScreenWidth()
  const theme = useTheme()
  function getTitle() {
    return <span style={{ color: theme.white }}>{title}</span>
  }
  const receiveFn = useCallback(() => {
    receive()
  }, [receive])
  const withdrawFn = useCallback(() => {
    withdraw()
  }, [withdraw])
  const depositFn = useCallback(() => {
    deposit()
  }, [deposit])
  return isPc ? (
    <PositionCardWarpper>
      <Title>{title}</Title>
      {list.length ? (
        list.map((v: any, index: any) => (
          <PositionCardItem
            deposit={depositFn}
            withdraw={withdrawFn}
            receive={receiveFn}
            tip={tip}
            type={type}
            item={v}
            key={index}
          ></PositionCardItem>
        ))
      ) : (
        <Empty>
          <img src={ti} alt="" /> 暂无仓位
        </Empty>
      )}
    </PositionCardWarpper>
  ) : list.length ? (
    list.map((v: any, index: any) => (
      <BaseCollapse
        isShowTitle={true}
        header={getTitle()}
        content={
          <PositionCardItem
            deposit={depositFn}
            withdraw={withdrawFn}
            receive={receiveFn}
            tip={tip}
            type={type}
            item={v}
            key={index}
          ></PositionCardItem>
        }
        key={index}
      ></BaseCollapse>
    ))
  ) : (
    <BaseCollapse
      isShowTitle={true}
      header={getTitle()}
      content={
        <Empty>
          <img src={ti} alt="" /> 暂无仓位
        </Empty>
      }
    ></BaseCollapse>
  )
}

export default memo(PositionCard)
