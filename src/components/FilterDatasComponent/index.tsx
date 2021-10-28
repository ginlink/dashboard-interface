import React, { useCallback, useState } from 'react'
import styled, { useTheme } from 'styled-components/macro'
import search from '../../assets/images/publicImg/search.svg'
import checkBox from '../../assets/images/publicImg/check-box.svg'
import checkBoxActived from '../../assets/images/publicImg/checked.svg'
import { MEDIUM } from '@/utils/adapteH5'
import { t } from '@/pages/adapteH5'

const Box = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ChangeBox = styled.div`
  ul {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    padding-left: 0;
  }
  li {
    list-style: none;
    font-size: 12px;
    color: ${(props) => props.theme.text8};
    cursor: pointer;
    padding-bottom: 5px;
    border-bottom: 3px solid transparent;
  }
  li:first-child {
    margin-right: 23px;
  }
  .active {
    border-bottom: 3px solid ${(props) => props.theme.primary1};
    color: ${(props) => props.theme.primary1};
  }
`
const SeatchBox = styled.div``
const InputWraper = styled.div`
  display: flex;
  justify-content: space-between;

  background-color: '#162133';
`

const InputCheck = styled.div`
  display: flex;
  align-items: center;
  & > img {
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
  & > span {
    font-size: 13px;
    line-height: 19px;
    margin-left: 6px;
  }
  @media (max-width: ${MEDIUM}) {
    & > img {
      width: 14px;
      height: 14px;
      cursor: pointer;
    }
    & > span {
      font-size: 13px;
      margin-left: 4px;
    }
  }
`

const Input = styled.div`
  margin-left: 26px;
  position: relative;
  & > input {
    width: 143px;
    border-radius: 14px;
    padding: 7px 15px 7px 30px;
    font-size: 11px;
    line-height: 15px;

    border: 0;
    outline: none;
    background-color: ${(props) => props.theme.black};
  }
  & > img {
    position: absolute;
    width: 12px;
    height: 12px;
    top: 50%;
    transform: translate(0, -50%);
    left: 16px;
  }
  @media (max-width: ${MEDIUM}) {
    margin-left: 15px;
    & > input {
      width: 120px;
      border-radius: 13px;
      padding: 7px 15px 7px 28px;
      font-size: 10px;
      line-height: 14px;
    }
    & > img {
      width: 10px;
      height: 10px;
      left: 15px;
    }
  }
`

export default function FilterDatasComponent({
  changeTypeFn,
  inputSearchFn,
  stakedFilterFn,
}: {
  changeTypeFn: (index: number) => void
  inputSearchFn: (value: string) => void
  stakedFilterFn: (checked: boolean) => void
}) {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [checked, setChecked] = useState(false)
  const changeFn = useCallback((index) => {
    setActiveIndex(index)
    changeTypeFn(index)
  }, [])
  const onKeyUp = useCallback((e: any) => {
    const keyUpString: string = e.target.value
    inputSearchFn(keyUpString)
  }, [])
  function toggleStakedFilter(e: any) {
    e.stopPropagation()
    setChecked(!checked)
    stakedFilterFn(!checked)
  }
  const theme = useTheme()
  return (
    <Box>
      <ChangeBox>
        <ul>
          <li onClick={() => changeFn(0)} className={activeIndex === 0 ? 'active' : ''}>
            全部
          </li>
          <li onClick={() => changeFn(1)} className={activeIndex === 1 ? 'active' : ''}>
            已下架
          </li>
        </ul>
      </ChangeBox>
      <SeatchBox>
        <InputWraper>
          <InputCheck className="imw-check">
            <img src={checkBox} style={{ display: !checked ? 'block' : 'none' }} onClick={toggleStakedFilter} />
            <img src={checkBoxActived} style={{ display: checked ? 'block' : 'none' }} onClick={toggleStakedFilter} />
            <span style={{ color: theme.text8 }}>已质押</span>
          </InputCheck>
          <Input className="imw-input">
            <img src={search} />
            <input
              type="text"
              onKeyUp={onKeyUp}
              placeholder={' Search Token'}
              style={{ backgroundColor: '#162133' }}
            ></input>
          </Input>
        </InputWraper>
      </SeatchBox>
    </Box>
  )
}
