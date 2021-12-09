import React, { useState } from 'react'
import styled from 'styled-components/macro'
import { Steps, Divider } from 'antd'
const { Step } = Steps

const Wrapper = styled.div``
const Title = styled.div`
  font-size: 20px;
  margin-bottom: 20px;
`
export default function CreationProcess() {
  const [current, setCurrent] = useState(0)
  return (
    <Wrapper>
      <Title>创建过程</Title>
      <Steps current={current} direction="vertical">
        <Step title="Step 1" description={'1111'} />
        <Step title="Step 2" description="This is a description." />
        <Step title="Step 3" description="This is a description." />
      </Steps>
    </Wrapper>
  )
}
