import React from 'react'
import { ContentBox, Title, Value } from './style'
export default function Card({
  width,
  height,
  cardTitle,
  color,
  cardValue,
}: {
  width?: number
  height?: number
  cardTitle: string
  color?: string
  cardValue: any
}) {
  return (
    <ContentBox width={width} height={height}>
      <Title>{cardTitle}</Title>
      <Value color={color}>${cardValue}</Value>
    </ContentBox>
  )
}
