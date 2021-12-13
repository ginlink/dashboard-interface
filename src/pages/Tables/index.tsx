import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components/macro'
import { DatePicker, Input, Button, Table, Pagination } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { getTableLists } from '@/services/api'
import bignumber from 'bignumber.js'
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
  .pagination-style {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 16px;
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
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '策略名称',
      dataIndex: 'strategy_name',
      key: 'strategy_name',
    },
    {
      title: 'apt地址',
      dataIndex: 'apt_address',
      key: 'apt_address',
      render: (text: any) => (
        <a href={bsc_address + text} target="_blank" className={'linkToColor'} rel="noreferrer">
          {processingData(text)}
        </a>
      ),
    },
    {
      title: 'apt开始余额',
      dataIndex: 'apt_start_amount',
      key: 'apt_start_amount',
      render: (text: any) => <span>{processingFee(text)}</span>,
    },
    {
      title: 'apt结束余额',
      dataIndex: 'apt_end_amount',
      key: 'apt_end_amount',
      render: (text: any) => <span>{processingFee(text)}</span>,
    },
    {
      title: '手续费开始余额',
      dataIndex: 'fee_start_amount',
      key: 'fee_start_amount',
      render: (text: any) => <span>{processingFee(text)}</span>,
    },
    {
      title: '手续费结束余额',
      dataIndex: 'fee_end_amount',
      key: 'fee_end_amount',
      render: (text: any) => <span>{processingFee(text)}</span>,
    },
    {
      title: '成功次数',
      dataIndex: 'success_times',
      key: 'success_times',
    },
    {
      title: '时间',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'apt_hash',
      dataIndex: 'apt_hash',
      key: 'apt_hash',
      render: (text: any) => (
        <a href={bsc_address + text} target="_blank" className={'linkToColor'} rel="noreferrer">
          {processingData(text)}
        </a>
      ),
    },
    {
      title: 'withdraw_hash',
      dataIndex: 'withdraw_hash',
      key: 'withdraw_hash',
      render: (text: any) => (
        <a href={bsc_address + text} target="_blank" className={'linkToColor'} rel="noreferrer">
          {processingData(text)}
        </a>
      ),
    },
  ]

  const [data, setData] = useState<any>([])
  const [searchValue, setSearchValue] = useState<any>()
  const [startTime, setStartTime] = useState<any>()
  const [endTime, setEndTime] = useState<any>()
  const [timeValue, setTimeValue] = useState<any>()
  const [total, setTotal] = useState<number>()
  const [pageSize, setPageSize] = useState(10)
  const [current, setCurrent] = useState<number>(1)
  const queryData = useCallback((searchParams) => {
    console.log('searchParams:', searchParams)
    getTableLists(searchParams).then((res) => {
      const { count, list } = res

      setData(list)
      setTotal(count)
    })
  }, [])
  //hash处理
  const processingData = useCallback((hash: string) => {
    if (hash) {
      const hideStr = hash.substring(4, hash.length - 4)
      return hash.replace(hideStr, '...')
    } else {
      return ''
    }
  }, [])
  //余额处理
  const processingFee = useCallback((fee) => {
    if (fee) {
      return new bignumber(fee).toFixed(4)
    } else {
      return ''
    }
  }, [])
  //搜索
  const clickSearch = useCallback(() => {
    const searchParams = {
      name: searchValue,
      start_time: startTime,
      end_time: endTime,
    } as SearchParams
    console.log('searchParams', searchParams)
    queryData(searchParams)
  }, [endTime, queryData, searchValue, startTime])
  //重置
  const clickReset = useCallback(() => {
    setSearchValue('')
    setStartTime('')
    setEndTime('')
    setTimeValue([])
    queryData({ page: 1, limit: pageSize, name: '', start_time: '', end_time: '' })
    setCurrent(1)
  }, [pageSize, queryData])
  const changeSearchValue = useCallback((event: any) => {
    setSearchValue(event.target.value)
  }, [])
  const changePicker = function (date: any, dateString: any) {
    setStartTime(dateString[0])
    setEndTime(dateString[1])
    setTimeValue(date)
  }
  // 切换下上一页
  function changePage(c: any) {
    setCurrent(c)
    queryData({ page: c, limit: pageSize, name: searchValue, start_time: startTime, end_time: endTime })
  }
  useEffect(() => {
    queryData({ page: current, limit: pageSize, name: searchValue, start_time: startTime, end_time: endTime })
  }, [])
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
        pagination={false}
        columns={columns}
        dataSource={data}
        style={{ marginTop: '10px' }}
        scroll={{ x: '100vw' }}
      ></Table>
      <Pagination
        className={'pagination-style'}
        defaultCurrent={1}
        total={total}
        showSizeChanger={false}
        onChange={changePage}
      />
    </Warpper>
  )
}
