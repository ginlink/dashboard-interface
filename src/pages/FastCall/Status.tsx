import { Card } from 'antd'
import React from 'react'
import styled from 'styled-components/macro'
import { Moment } from 'moment'
import { DEFAULT_FORMAT_DATE } from '@/constants/misc'

export type StatusItem = {
  date?: Moment
  content?: string
}

const Wrapper = styled.div``

export default function Status({ date, content }: StatusItem) {
  return (
    <Wrapper>
      [{date?.format(DEFAULT_FORMAT_DATE)}]: {content}
    </Wrapper>
  )
}
