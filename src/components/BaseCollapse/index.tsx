import React, { useState } from 'react'
import { Collapse } from 'antd'
import { useTheme } from 'styled-components'
import styled from 'styled-components/macro'
import { DataListBase } from '@/mock'

const { Panel } = Collapse
interface BaseCollapseInterface {
  isShowTitle: boolean
  header: any
  content: any
  propActiveKey?: any
  changeActiveKey?: (key: any) => void
  item?: DataListBase
}
const Warpper = styled.div`
  .ant-collapse {
    max-width: 825px !important;
    background: #162133 !important;
    box-shadow: 0px 2px 26px 0px rgba(12, 23, 41, 1) !important;
    border-radius: 15px !important;
    padding: 0;
    margin-bottom: 18px !important;
    border: 0 !important;
  }
  .ant-collapse-item:last-child > .ant-collapse-content {
    border-radius: 0 0 15px 15px !important;
    background: #162133;
    border-top: 0;
  }
  .ant-layout-content {
    background: #0c1626 !important;
  }

  .ant-collapse > .ant-collapse-item {
    border-bottom: 0 !important;
  }

  .ant-collapse {
    width: 100%;
  }
  .anticon {
    color: #8391a8;
  }
`
export default function BaseCollapse({
  isShowTitle,
  header,
  content,
  propActiveKey,
  changeActiveKey,
  item,
}: BaseCollapseInterface) {
  const [extraStr, setExtraStr] = useState(isShowTitle ? '收起' : '')
  function changTitle(e: any) {
    isShowTitle ? (e.length ? setExtraStr('收起') : setExtraStr('展开')) : setExtraStr('')
    if (changeActiveKey) {
      changeActiveKey(e)
    } else if (isShowTitle) {
      setDefaultKey(e)
    }
  }
  const theme = useTheme()
  function getExtra() {
    return <span style={{ color: theme.text8 }}>{extraStr}</span>
  }
  const [defaultKey, setDefaultKey] = useState(['1'])
  return (
    <Warpper>
      <Collapse
        defaultActiveKey={isShowTitle ? defaultKey : propActiveKey}
        activeKey={isShowTitle ? defaultKey : propActiveKey}
        expandIconPosition={'right'}
        onChange={changTitle}
      >
        <Panel header={header} key={item ? item.id : '1'} extra={getExtra()}>
          {content}
        </Panel>
      </Collapse>
    </Warpper>
  )
}
