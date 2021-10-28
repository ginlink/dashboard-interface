import React, { useState, useCallback } from 'react'
import { ChangeCurrencyWarpper, Item } from './style'
export default function ChangeCurrency({
  currencyNames,
  changeCurrencyFn,
}: {
  currencyNames: Array<string>
  changeCurrencyFn: (index: number) => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const changeCurrency = useCallback((index: number) => {
    setActiveIndex(index)
    changeCurrencyFn(index)
  }, [])
  return (
    <ChangeCurrencyWarpper>
      {currencyNames.map((v, index) => (
        <Item onClick={() => changeCurrency(index)} key={index} className={activeIndex === index ? 'active' : ''}>
          {v}
        </Item>
      ))}
    </ChangeCurrencyWarpper>
  )
}
