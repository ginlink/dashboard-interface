/*
 * @Author: jiangjin
 * @Date: 2021-09-16 15:52:48
 * @LastEditTime: 2021-09-27 11:52:42
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import { useIsPcByScreenWidth } from '@/hooks/useIsPc'
import { useActivePopupList } from '@/store/application/hooks'
import { MEDIUM } from '@/utils/adapteH5'
import React, { memo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components/macro'
import PopupItem from './PopupItem'

const PopupsWraper = styled.div<{ isPc: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 2;

  position: ${({ isPc }) => (isPc ? 'absolute' : 'relative')};
  /* right: ${({ isPc }) => (isPc ? '24px' : '')}; */
  right: ${({ isPc }) => (isPc ? '0' : '')};

  margin-top: 13px;

  overflow-x: scroll;

  ::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */

  @media (max-width: ${MEDIUM}) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
`

const counter = 2
function Popups() {
  const popupList = useActivePopupList()
  const dispatch = useDispatch()
  const isPc = useIsPcByScreenWidth()

  useEffect(() => {
    // 添加测试
    // dispatch(addPopupAction({ tx: { hash: '0x01', success: true } }, 3000))
    // dispatch(addPopupAction({ tx: { hash: '0x02', success: false } }, 3000))
    // dispatch(addPopupAction({ tx: { hash: '0x03', success: true } }, 3000))
    // dispatch(addPopupAction({ tx: { hash: '0x04', success: true } }, 3000))
    // dispatch(addPopupAction({ tx: { hash: '0x05', success: true } }, 3000))
    // dispatch(addPopupAction({ tx: { hash: '0x06', success: false } }, 3000))
    // setInterval(() => {
    //   dispatch(addPopupAction({ tx: { hash: '0x0' + counter++, success: counter % 2 === 0 } }, 3000))
    // }, 2000)
  }, [dispatch])

  useEffect(() => {
    console.debug('[Popups](popupList):', popupList)
  }, [popupList])

  return (
    <PopupsWraper isPc={isPc}>
      {popupList.map((item) => {
        return <PopupItem {...item} popKey={item.key} key={item.key} />
      })}
    </PopupsWraper>
  )
}

export default memo(Popups)
