/*
 * @Author: jiangjin
 * @Date: 2021-09-16 16:41:27
 * @LastEditTime: 2021-09-27 14:08:22
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import { PopupContent, removePopupAction } from '@/store/application/action'
import { MEDIUM } from '@/utils/adapteH5'
import React, { memo, useCallback, useEffect } from 'react'
import { X } from 'react-feather'
import { useDispatch } from 'react-redux'
import styled from 'styled-components/macro'
import TransactionPopup from './TransactionPopup'

const PopItemWrapper = styled.div<{ success: boolean }>`
  background-color: ${(props) => props.theme.white};

  padding: 7px 15px;
  border-radius: 7px;
  margin: 7px 0;
  width: 260px;
  max-width: 260px;
  word-break: break-word;

  position: relative;
  @media (max-width: ${MEDIUM}) {
    margin: 0 7px;
    flex: 0 0 260px;

    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
`

export const StyledClose = styled(X)`
  position: absolute;
  right: 10px;
  top: 10px;

  :hover {
    cursor: pointer;
  }
`

function PopupItem({
  removeAfterMs,
  content: { tx },
  popKey,
}: {
  removeAfterMs: number
  content: PopupContent
  popKey: string
}) {
  const dispatch = useDispatch()

  const removeThisPop = useCallback(() => {
    console.debug('[清除pop](key):', popKey)

    dispatch(removePopupAction(popKey))
  }, [dispatch, popKey])

  const closePopup = useCallback(() => {
    dispatch(removePopupAction(popKey))
  }, [dispatch, popKey])

  useEffect(() => {
    const timer = setTimeout(() => {
      // 清除pop
      removeThisPop()
    }, removeAfterMs)
    return () => {
      clearTimeout(timer)
    }
  }, [removeAfterMs, removeThisPop])

  return (
    <PopItemWrapper success={tx.success}>
      <StyledClose size={16} color={'#162133'} onClick={closePopup} />

      <TransactionPopup {...tx} />
    </PopItemWrapper>
  )
}

export default memo(PopupItem)
