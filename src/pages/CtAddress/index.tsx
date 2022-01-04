import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AddAddressModal from '@/components/AddAddressModal'
import {
  ButtonPrimary,
  ButtonPrimaryReverse,
  SmallButtonError,
  SmallButtonPrimary,
  SmallButtonYellow,
} from '@/components/Button'
import {
  CtAddress,
  crateCtAddressApi,
  getCtAddressApi,
  deleteCtAddressApi,
  updateCtAddressApi,
  searchCtAddressApi,
  AddressSearchParams,
} from '@/services/api'
import { TYPE } from '@/theme'
import { Card, Form, Input, message, Popconfirm, Row, Select, Space, Table } from 'antd'
import styled from 'styled-components/macro'
import Loader from '@/components/Loader'

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

const chainIds = [
  { id: 56, name: 'bsc' },
  {
    id: 97,
    name: 'bsc-test',
  },
]

export default function CtAddressPage() {
  const [open, setOpen] = useState(false)
  const [updateId, setUpdateId] = useState(0)

  const [dataSource, setDataSource] = useState<any[] | undefined>(undefined)
  const [searchParam, setSearchParam] = useState<AddressSearchParams | undefined>(undefined)

  const [isSearching, setIsSearching] = useState(false)

  const addForm = Form.useForm()[0]
  const searchForm = Form.useForm()[0]

  const freshData = useCallback((searchParam?: AddressSearchParams) => {
    searchCtAddressApi(searchParam).then((res: { list?: CtAddress[]; count?: number }) => {
      console.log('[](res):', res)

      const { list, count } = res

      if (!list || !list.length) {
        setDataSource(undefined)
        setIsSearching(false)
        return
      }

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
      setIsSearching(false)
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
                  addForm.setFieldsValue(record)
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
  }, [addForm, freshData])

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

        addForm.resetFields()
        freshData()
        setOpen(false)
      } catch (err) {
        console.log('[](err):', err)
      }
    },
    [addForm, freshData, updateId]
  )

  const onSearchFinish = useCallback(
    (values: { chainId?: string; address?: string; symbol?: string }) => {
      console.log('[](values):', values)
      const { chainId, address, symbol } = values

      setSearchParam((prev) => {
        const newParam: AddressSearchParams = {
          ...prev,
          key_chainid: chainId ? parseInt(chainId) : undefined,
          key_address: address,
          key_symbol: symbol,
        }

        // filter undefined
        for (const key in newParam) {
          if (!newParam[key]) {
            delete newParam[key]
          }
        }

        freshData(newParam)

        return newParam
      })
    },
    [freshData]
  )

  useEffect(() => {
    freshData()
  }, [freshData])

  return (
    <Wrapper>
      <Card>
        <Row style={{ justifyContent: 'space-between', display: 'flex' }}>
          {/* <TYPE.subHeader>搜索面板</TYPE.subHeader> */}
          <Form name="basic" onFinish={onSearchFinish} autoComplete="off" form={searchForm}>
            <Space>
              <Form.Item label="chainId" name="chainId">
                <Select style={{ minWidth: '100px' }}>
                  <Select.Option value={''}> </Select.Option>
                  {chainIds.map((item) => {
                    const { id, name } = item

                    return <Select.Option value={id} key={id}>{`[${id}] ${name}`}</Select.Option>
                  })}
                </Select>
              </Form.Item>

              <Form.Item label="address" name="address">
                <Input />
              </Form.Item>

              <Form.Item label="symbol" name="symbol">
                <Input />
              </Form.Item>

              <Space>
                <Form.Item>
                  <ButtonPrimary
                    disabled={isSearching}
                    style={{ width: 'fit-content', height: 'fit-content' }}
                    onClick={(e) => {
                      e.preventDefault()

                      setIsSearching(true)
                      searchForm.submit()
                    }}
                  >
                    Search
                    {isSearching && <Loader size="14px" stroke="#448ef7" style={{ marginLeft: '4px' }} />}
                  </ButtonPrimary>
                </Form.Item>

                <Form.Item>
                  <ButtonPrimaryReverse
                    onClick={(e) => {
                      searchForm.resetFields()

                      e.preventDefault()
                    }}
                    style={{ width: 'fit-content', height: 'fit-content' }}
                  >
                    Reset
                  </ButtonPrimaryReverse>
                </Form.Item>
              </Space>
            </Space>
          </Form>

          <ButtonPrimary
            onClick={() => {
              addForm?.resetFields()
              setUpdateId(0)
              setOpen(true)
            }}
            style={{ width: 'fit-content', height: 'fit-content' }}
          >
            新增
          </ButtonPrimary>
        </Row>
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
        form={addForm}
        onDismiss={() => setOpen(false)}
        onSuccess={() => {
          if (!addForm) return

          addForm.submit()
        }}
        onFinish={onFinish}
      />
    </Wrapper>
  )
}
