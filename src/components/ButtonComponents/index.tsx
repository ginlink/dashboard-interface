/*
 * @Author: your name
 * @Date: 2021-09-01 16:50:04
 * @LastEditTime: 2021-09-08 16:51:20
 * @LastEditors: jiangjin
 * @Description: In User Settings Edit
 * @FilePath: /converter-bsc-web/src/components/ButtonComponents/index.tsx
 */
import { MEDIUM, px2vwm } from '@/utils/adapteH5'
import React from 'react'
import styled from 'styled-components/macro'
const BtnBox = styled.button<{ backgroundColor?: string; disabled?: boolean }>`
  height: 29px;
  background: ${({ backgroundColor, disabled }) =>
    backgroundColor ? backgroundColor : !disabled ? '#ffab36' : '#534838'};
  border: ${({ backgroundColor }) => (backgroundColor ? '1px solid #FFAB36' : '0')};
  font-size: 11px;
  color: ${({ backgroundColor }) => (backgroundColor ? '#FFAB36' : '#131d32')};
  margin-top: ${({ backgroundColor }) => (backgroundColor ? '12px' : '0')};
  border-radius: 17px;
  padding: 6px 25px;
  @media (max-width: ${MEDIUM}) {
    padding: ${px2vwm('6px')} ${px2vwm('12px')};
    /* padding: ${px2vwm('6px')} ${px2vwm('21px')}; */
    min-width: ${px2vwm('82px')};
  }

  &:active,
  &:focus {
    outline: none;
  }
`
export default function ButtonComponent({
  btnName,
  backgroundColor,
  disabled = false,
  clickBtn,
}: {
  btnName: string
  backgroundColor?: string
  disabled?: boolean
  clickBtn: () => void
}) {
  return (
    <BtnBox disabled={disabled} backgroundColor={backgroundColor} onClick={clickBtn}>
      {btnName}
    </BtnBox>
  )
}
