/*
 * @Author: jiangjin
 * @Date: 2021-09-02 22:01:32
 * @LastEditTime: 2021-09-19 16:36:41
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import React from 'react'
import styled from 'styled-components/macro'
import { Token } from '@uniswap/sdk-core'

const InputBaseWrapper = styled.div`
  .input-base {
    padding: 0 7px;
    font-size: 12px;
    line-height: 17px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export function InputBase({
  placeholder = '0.00',
  onValueChange,
  value,
}: {
  placeholder?: string
  onValueChange: (value: string | undefined) => void
  value: string | undefined
}) {
  return (
    <InputBaseWrapper>
      <input
        className="input-base"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
      />
    </InputBaseWrapper>
  )
}
