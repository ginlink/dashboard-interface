import { MEDIUM } from '@/utils/adapteH5'
import React from 'react'
import styled from 'styled-components/macro'

const PartnerImgWarpper = styled.div`
  img {
    /* margin-right: 50px; */
    margin-bottom: 30px;
  }
  @media (max-width: ${MEDIUM}) {
    img {
      /* margin-right: 0px; */
      margin-bottom: 15px;
    }
  }
`
export default function PartnerImgComponent({ imgUrl }: { imgUrl: string }) {
  return (
    <PartnerImgWarpper>
      <img src={imgUrl} alt="" />
    </PartnerImgWarpper>
  )
}
