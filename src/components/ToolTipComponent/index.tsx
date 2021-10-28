import React from 'react'
import { Tooltip } from 'antd'
import help from '../../assets/images/publicImg/icon-help.svg'
import styled, { useTheme } from 'styled-components'
const Warpper = styled.span``
export default function TooltipComponent({ text }: { text: any }) {
  const theme = useTheme()
  return (
    <Warpper onClick={(e) => e.stopPropagation()}>
      <Tooltip placement="right" title={text} color={theme.white}>
        <img src={help} alt="" />
      </Tooltip>
    </Warpper>
  )
}
