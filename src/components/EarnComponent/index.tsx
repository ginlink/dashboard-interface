import React from 'react'
import styled from 'styled-components/macro'
import SingleLogo from '../SingleLogo'
import con from '../../assets/images/publicImg/con.svg'
import { WrappedTokenInfo } from '@/types/wrappedTokenInfo'

interface EarnComponentInterface {
  imgAddresses: Array<WrappedTokenInfo | undefined>
  size?: number
}
const Wrapper = styled.div<{ length: number; size?: number }>`
  display: flex;
  align-items: center;
  & > img:last-child {
    margin-top: 2px;
    width: ${({ size }) => (size ? size + 'px' : '16px')};
    height: ${({ size }) => (size ? size + 'px' : '16px')};
  }

  & > .logo-img-style:first-child {
    img {
      position: relative;
      left: ${({ length }) => (length === 1 ? '6px' : '12px')};
      z-index: 2;
    }
  }
  & > .logo-img-style {
    img {
      position: relative;
      left: 6px;
      z-index: 1;
    }
  }
`
export default function EarnComponent({ imgAddresses, size }: EarnComponentInterface) {
  return (
    <Wrapper size={size} length={imgAddresses.length}>
      {imgAddresses.map((v, index) => (
        <SingleLogo size={size} currency={v} key={index}></SingleLogo>
      ))}
      <img src={con} alt="" />
    </Wrapper>
  )
}
