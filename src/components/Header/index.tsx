/*
 * @Author: your name
 * @Date: 2021-09-01 14:15:56
 * @LastEditTime: 2021-10-28 16:17:48
 * @LastEditors: jiangjin
 * @Description: In User Settings Edit
 * @FilePath: /converter-bsc-web/src/components/Header/index.tsx
 */
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'
import React, { memo } from 'react'
import styled from 'styled-components/macro'

import HeaderPC from './HeaderPC'
const HeaderWrapper = styled.div<{ isPc: boolean }>`
  margin: 13px 24px;

  position: ${({ isPc }) => (isPc ? 'absolute' : '')};
  right: ${({ isPc }) => (isPc ? '0' : '')};
`

const HeaderInnerWrapper = styled.div<{ isPc: boolean }>`
  width: 100%;

  position: ${(props) => (props.isPc ? 'relative' : '')};
  z-index: ${(props) => (props.isPc ? '3' : '')};
`
function Header() {
  const isPc = useIsPcByScreenWidth()
  return (
    <HeaderWrapper isPc={isPc}>
      <HeaderPC />
    </HeaderWrapper>
  )
}

export default memo(Header)
