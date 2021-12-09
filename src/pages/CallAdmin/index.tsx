import AddFuncModal from '@/components/AddFuncModal'
import { ButtonPrimary } from '@/components/Button'
import { CtFunction, addFunctionApi, getFunctionApi } from '@/services/api'
import { TYPE } from '@/theme'
import { Card, Form, Input, message, Pagination, Space, Table } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { parseFunc } from './util'

const Wrapper = styled.div``

// const dataSource = [
//   {
//     key: '1',
//     name: '胡彦斌',
//     age: 32,
//     address: '西湖区湖底公园1号',
//   },
//   {
//     key: '2',
//     name: '胡彦祖',
//     age: 42,
//     address: '西湖区湖底公园1号',
//   },
// ]

// const columns = [
//   {
//     title: '姓名',
//     dataIndex: 'name',
//     key: 'name',
//   },
//   {
//     title: '年龄',
//     dataIndex: 'age',
//     key: 'age',
//   },
//   {
//     title: '住址',
//     dataIndex: 'address',
//     key: 'address',
//   },
// ]

export default function CallAdmin() {
  const [open, setOpen] = useState(false)

  const [dataSource, setDataSource] = useState<any[] | undefined>(undefined)
  const [columns, setColumns] = useState<any[] | undefined>(undefined)

  const [form] = Form.useForm()

  const freshData = useCallback(() => {
    getFunctionApi().then((res: { list?: CtFunction[]; count?: number }) => {
      console.log('[](res):', res)

      const { list, count } = res

      if (!list || !list.length) return

      const columns: any[] = [
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '函数名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '参数',
          dataIndex: 'param',
          key: 'param',
        },
        {
          title: 'function',
          dataIndex: 'origin',
          key: 'origin',
        },
        {
          title: '描述',
          dataIndex: 'desc',
          key: 'desc',
        },
      ]
      const dataSource: any[] = []

      list?.forEach((item) => {
        const { id, name, param, origin, desc } = item

        dataSource.push({
          key: item?.id,
          id,
          name,
          param,
          origin,
          desc,
        })
      })

      setColumns(columns)
      setDataSource(dataSource)
    })
  }, [])

  const onSuccess = useCallback(() => {
    if (!form) return

    form.submit()
  }, [form])

  const onFinish = useCallback(
    async (values: any) => {
      console.log('[](values):', values)

      const { origin, desc } = values

      const { name, param, type } = parseFunc(origin)

      if (!name || !param) {
        // TODO参数解析出错
        return message.error('解析出错')
      }

      const ctFunc: CtFunction = {
        name,
        type,
        param,
        origin,
        desc,
      }

      // debugger

      try {
        await addFunctionApi(ctFunc)

        form.resetFields()
        freshData()
        message.success('Add success!')
        setOpen(false)
      } catch (err) {
        console.log('[](err):', err)
      }
    },
    [form, freshData]
  )

  useEffect(() => {
    freshData()
  }, [freshData])

  return (
    <Wrapper>
      <Card>
        <Space>
          <TYPE.subHeader>搜索面板</TYPE.subHeader>
        </Space>
      </Card>

      <Card style={{ marginTop: '16px' }}>
        <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
          <ButtonPrimary onClick={() => setOpen(true)}>新增</ButtonPrimary>
        </Space>
      </Card>

      {/* <Space>
        <Input
          className={'input-style'}
          onChange={()=> }
          placeholder="请输入"
          allowClear={true}
          value={searchValue}
        />
      </Space> */}
      <Table
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        style={{ marginTop: '10px' }}
        scroll={{ x: '100vw' }}
      ></Table>
      {/* <Pagination
        className={'pagination-style'}
        defaultCurrent={1}
        total={total}
        showSizeChanger={false}
        onChange={changePage}
      /> */}

      <AddFuncModal
        open={open}
        form={form}
        onDismiss={() => setOpen(false)}
        onFinish={onFinish}
        onSuccess={onSuccess}
      />
    </Wrapper>
  )
}
