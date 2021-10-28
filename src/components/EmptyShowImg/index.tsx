import React from 'react'
import empty from '../../assets/images/publicImg/empty.svg'
import styled from 'styled-components/macro'
import { MEDIUM } from '@/utils/adapteH5'
import { t } from '@/pages/adapteH5'
const Box = styled.div`
  text-align: center;
  width: 100%;
  div {
    font-size: 11px;
    font-weight: 500;
    color: ${(props) => props.theme.text8};
  }
  @media (max-width: ${MEDIUM}) {
    margin-bottom: 100px;
  }
`
export default function EmptyShowImg() {
  return (
    <Box>
      <img src={empty} alt="" />
      <div>这里什么也没有</div>
    </Box>
  )
}
