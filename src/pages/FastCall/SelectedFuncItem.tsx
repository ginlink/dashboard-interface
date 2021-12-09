import { ButtonError, ButtonPrimary } from '@/components/Button'
import Row from '@/components/Row'
import { TYPE } from '@/theme'
import { Color } from '@/theme/styled'
import { Checkbox, Input, Space } from 'antd'
import { darken } from 'polished'
import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components/macro'
import { FuncType } from '../CallAdmin/util'

const Wrapper = styled(Row)`
  gap: 8px;
`

const MyButtonError = styled(ButtonError)`
  padding: 0;
  border-radius: 4px;
  height: unset;
`

export type SelectedFuncItemProps = {
  id?: number
  name?: string
  param?: string
  type?: FuncType
  onDelete?: (id?: number) => void
}

export default function SelectedFuncItem({ id, name = 'null', param, onDelete }: SelectedFuncItemProps) {
  return (
    <Wrapper>
      <Space>
        {/* TODO增加选中的功能 */}
        {/* <Checkbox /> */}

        <Space>
          <MyButtonError error={true} onClick={() => onDelete && onDelete(id)}>
            <TYPE.small>删除</TYPE.small>
          </MyButtonError>
        </Space>

        <TYPE.main>
          {id} {name}({param})
        </TYPE.main>
      </Space>
    </Wrapper>
  )
}
