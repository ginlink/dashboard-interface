import { ButtonError, ButtonPrimary } from '@/components/Button'
import Row from '@/components/Row'
import { Color } from '@/theme/styled'
import { Checkbox, Input, Space } from 'antd'
import { darken } from 'polished'
import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components/macro'
import { FuncType } from '../CallAdmin/util'

const Wrapper = styled(Row)`
  gap: 8px;
`

// const MyButtonPrimary = styled(ButtonPrimary)<{ color: Color }>`
//   background-color: ${({ color }) => color};
//   width: fit-content;
//   white-space: nowrap;
//   border-radius: 10px;
// `

const MyButtonGreen = styled(ButtonPrimary)`
  background-color: ${({ theme }) => theme.green1};
  width: fit-content;
  white-space: nowrap;
  border-radius: 10px;

  :hover {
    background-color: ${({ theme }) => darken(0.05, theme.green1)};
    border: 1px solid transparent;
  }

  :active,
  :focus {
    background-color: ${({ theme }) => theme.green1};
    border: 1px solid transparent;
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.green1};
  }
`

const MyButtonRed = styled(ButtonPrimary)`
  background-color: ${({ theme }) => theme.red1};
  width: fit-content;
  white-space: nowrap;
  border-radius: 10px;

  :hover {
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  :active,
  :focus {
    background-color: ${({ theme }) => theme.red1};
  }
`

export type FunctionItemProps = {
  name?: string
  param?: string
  type?: FuncType
  onClick?: (values: any) => void
}

export default function FunctionItem({ name = 'null', param, type, onClick }: FunctionItemProps) {
  const [valueInput, setValueInput] = useState('')
  const theme = useTheme()

  return (
    <Wrapper>
      <Checkbox />

      {type == FuncType.READ ? (
        <MyButtonGreen onClick={() => onClick && onClick(valueInput)}>{name}</MyButtonGreen>
      ) : (
        <MyButtonRed onClick={() => onClick && onClick(valueInput)}>{name}</MyButtonRed>
      )}

      <Input
        value={valueInput}
        onChange={(e) => setValueInput(e.target?.value)}
        style={{ width: '100%' }}
        placeholder={param}
      />
    </Wrapper>
  )
}
