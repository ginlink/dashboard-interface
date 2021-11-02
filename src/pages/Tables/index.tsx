import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components/macro'
import { DatePicker, Input, Button, Table, Tag, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { getTableLists } from '@/services/api'

const { RangePicker } = DatePicker
const Warpper = styled.div`
  color: black;
  .input-style {
    width: 20%;
  }
  .ant-picker-range {
    width: 20%;
    margin-right: 10px;
  }
  .ant-table-wrapper {
    margin-top: 20px;
  }
  .reset-style {
    margin-right: 10px;
  }
  .linkToColor {
    color: #2090ff;
  }
`
const ItemBox = styled.div`
  margin-bottom: 6px;
`
interface SearchParams {
  name?: string
  start_time?: string
  end_time?: string
}
export default function TestComponent() {
  const bsc_address = 'https://bscscan.com/address/'
  const columns = [
    {
      title: 'strategy_name',
      dataIndex: 'strategy_name',
      key: 'strategy_name',
    },
    {
      title: 'apt_address',
      dataIndex: 'apt_address',
      key: 'apt_address',
      render: (text: any) => (
        <a href={bsc_address + text} target="_blank" className={'linkToColor'} rel="noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: 'apt_start_amount',
      dataIndex: 'apt_start_amount',
      key: 'apt_start_amount',
    },
    {
      title: 'apt_end_amount',
      dataIndex: 'apt_end_amount',
      key: 'apt_end_amount',
    },
    {
      title: 'fee_start_amount',
      dataIndex: 'fee_start_amount',
      key: 'fee_start_amount',
    },
    {
      title: 'fee_end_amount',
      dataIndex: 'fee_end_amount',
      key: 'fee_end_amount',
    },
    {
      title: 'success_times',
      dataIndex: 'success_times',
      key: 'success_times',
    },
    {
      title: 'date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'apt_hash',
      dataIndex: 'apt_hash',
      key: 'apt_hash',
      render: (text: any) => (
        <a href={bsc_address + text} target="_blank" className={'linkToColor'} rel="noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: 'withdraw_hash',
      dataIndex: 'withdraw_hash',
      key: 'withdraw_hash',
      render: (text: any) => (
        <a href={bsc_address + text} target="_blank" className={'linkToColor'} rel="noreferrer">
          {text}
        </a>
      ),
    },
  ]

  const [data, setData] = useState<any>([])
  const [list, setList] = useState<any>([])
  const [searchValue, setSearchValue] = useState<any>()
  const [startTime, setStartTime] = useState<any>()
  const [endTime, setEndTime] = useState<any>()
  const [timeValue, setTimeValue] = useState<any>()
  const queryData = useCallback(
    (searchParams) => {
      getTableLists(searchParams).then((res) => {
        console.log('res:', res)
        setData(res)
        setTotal(data.length)
      })
    },
    [data.length]
  )
  const clickSearch = useCallback(() => {
    const searchParams = {
      name: searchValue,
      start_time: startTime,
      end_time: endTime,
    } as SearchParams
    console.log('searchParams', searchParams)
    queryData(searchParams)
  }, [endTime, queryData, searchValue, startTime])
  const clickReset = useCallback(() => {
    setSearchValue('')
    setStartTime('')
    setEndTime('')
    setTimeValue([])
    queryData({})
  }, [queryData])
  const changeSearchValue = useCallback((event: any) => {
    setSearchValue(event.target.value)
  }, [])
  const changePicker = function (date: any, dateString: any) {
    setStartTime(dateString[0])
    setEndTime(dateString[1])
    setTimeValue(date)
  }
  // 表格数据的总条数
  const totals = data.length
  // 回调函数，切换下上一页
  function changePage(current: any) {
    setCurrent(current)
  }
  const [total, setTotal] = useState(data.length)
  const [pageSize, setPageSize] = useState(10)
  const [current, setCurrent] = useState(1)
  useEffect(() => {
    queryData({})
  }, [])

  // 表格分页属性
  const paginationProps = {
    showTotal: () => `共${total}条`,
    pageSize: pageSize,
    current: current,
    total: totals,
    onChange: (current: any) => changePage(current),
  }
  return (
    <Warpper>
      <ItemBox>
        <Input
          className={'input-style'}
          onChange={changeSearchValue}
          placeholder="请输入"
          allowClear={true}
          value={searchValue}
        />
      </ItemBox>
      <ItemBox>
        <RangePicker value={timeValue} placeholder={['开始时间', '结束时间']} onChange={changePicker} showTime />
        <Button onClick={clickReset} className={'reset-style'}>
          重置
        </Button>
        <Button onClick={clickSearch} icon={<SearchOutlined />}>
          查询
        </Button>
      </ItemBox>
      <Table
        pagination={paginationProps}
        columns={columns}
        dataSource={data}
        style={{ marginTop: '10px' }}
        scroll={{ x: '100vw' }}
      ></Table>
    </Warpper>
  )
}
