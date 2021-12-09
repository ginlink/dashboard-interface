import React, { memo } from 'react'
import styled from 'styled-components/macro'

import HeaderPC from './HeaderPC'

const HeaderWrapper = styled.div`
  margin: 13px 24px;

  position: absolute;
  right: 0;
`

function Header() {
  return (
    <HeaderWrapper>
      <HeaderPC />
    </HeaderWrapper>
  )
}

export default memo(Header)
