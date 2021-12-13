import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AddAddressModal from '@/components/AddAddressModal'
import { ButtonPrimary, SmallButtonError, SmallButtonPrimary, SmallButtonYellow } from '@/components/Button'
import { CtAddress, crateCtAddressApi, getCtAddressApi, deleteCtAddressApi, updateCtAddressApi } from '@/services/api'
import { TYPE } from '@/theme'
import { Card, Form, message, Popconfirm, Space, Table } from 'antd'
import styled from 'styled-components/macro'

const Wrapper = styled.div``

const defaultColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    width: 70,
    fixed: 'left',
  },
  {
    title: 'chainId',
    dataIndex: 'chainId',
    key: 'chainId',
    width: 100,
    fixed: 'left',
  },
  {
    title: 'address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    width: 100,
  },
  {
    title: '描述',
    dataIndex: 'desc',
    key: 'desc',
  },
  {
    title: 'decimals',
    dataIndex: 'decimals',
    key: 'decimals',
    width: 100,
  },
  {
    title: 'logoURI',
    dataIndex: 'logoURI',
    key: 'logoURI',
  },
]

export default function CtAddressPage() {
  const [open, setOpen] = useState(false)
  const [updateId, setUpdateId] = useState(0)

  const [dataSource, setDataSource] = useState<any[] | undefined>(undefined)

  const [form] = Form.useForm()

  const freshData = useCallback(() => {
    getCtAddressApi().then((res: { list?: CtAddress[]; count?: number }) => {
      console.log('[](res):', res)

      const { list, count } = res

      if (!list || !list.length) return

      const dataSource: any[] = []

      list?.forEach((item) => {
        const { id, chainId, address, decimals, symbol, logoURI, desc } = item

        dataSource.push({
          key: item?.id,
          id,
          chainId,
          address,
          decimals,
          symbol,
          logoURI,
          desc,
        })
      })

      setDataSource(dataSource)
    })
  }, [])

  const columns: any[] = useMemo(() => {
    return [
      ...defaultColumns,
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        fixed: 'right',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <Space>
              <Popconfirm
                title="Are you sure to delete this?"
                onConfirm={async () => {
                  await deleteCtAddressApi(record.id)
                  freshData()
                  message.success('删除成功')
                }}
                onCancel={() => void 0}
                okText="Yes"
                cancelText="No"
              >
                <SmallButtonError error={true}>Delete</SmallButtonError>
              </Popconfirm>

              <SmallButtonYellow
                onClick={() => {
                  setOpen(true)
                  form.setFieldsValue(record)
                  setUpdateId(record.id)
                }}
              >
                Update
              </SmallButtonYellow>
            </Space>
          )
        },
      },
    ]
  }, [form, freshData])

  const onFinish = useCallback(
    async (values: any) => {
      console.log('[](values):', values)

      const { chainId, address, decimals, symbol, logoURI, desc } = values

      const data: CtAddress = {
        chainId,
        address,
        decimals,
        symbol,
        logoURI,
        desc,
      }

      // debugger

      try {
        if (updateId) {
          await updateCtAddressApi(updateId, data)
          message.success('update success!')
        } else {
          await crateCtAddressApi(data)
          message.success('Add success!')
        }

        form.resetFields()
        freshData()
        setOpen(false)
      } catch (err) {
        console.log('[](err):', err)
      }
    },
    [form, freshData, updateId]
  )

  useEffect(() => {
    freshData()
  }, [freshData])

  return (
    <Wrapper>
      <Card>
        <Space style={{ justifyContent: 'space-between', display: 'flex' }}>
          <TYPE.subHeader>搜索面板</TYPE.subHeader>
          <ButtonPrimary
            onClick={() => {
              form?.resetFields()
              setUpdateId(0)
              setOpen(true)
            }}
          >
            新增
          </ButtonPrimary>
        </Space>
      </Card>

      {/* <Card style={{ marginTop: '16px' }}>
        <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
          <ButtonPrimary onClick={() => setOpen(true)}>新增</ButtonPrimary>
        </Space>
      </Card> */}

      <Table
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        style={{ marginTop: '16px' }}
        scroll={{ x: '100vw' }}
      ></Table>

      <AddAddressModal
        open={open}
        updateId={updateId}
        form={form}
        onDismiss={() => setOpen(false)}
        onSuccess={() => {
          if (!form) return

          form.submit()
        }}
        onFinish={onFinish}
      />
    </Wrapper>
  )
}
