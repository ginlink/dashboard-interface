import React from 'react'
import styled from 'styled-components/macro'
import { Input } from 'antd'
const NameWrapper = styled.div``

type SafetyNoxNameType = {
  nameValue: string
  changeNameValue: (e: any) => void
}
export default function SafetyNoxName({ nameValue, changeNameValue }: SafetyNoxNameType) {
  return (
    <NameWrapper>
      <Input placeholder="" value={nameValue} onChange={changeNameValue} size="large" />
    </NameWrapper>
  )
}
