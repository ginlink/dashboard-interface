import React, { useState, useEffect, createRef, useCallback, useRef } from 'react'
import styled from 'styled-components/macro'
import { Table, Tag, Space } from 'antd'
import { getTransctionList } from '@/services/api'
import { Modal, Button } from 'antd'
const columns = [
  {
    title: 'txId',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'tx_hash',
    dataIndex: 'tx_hash',
    key: 'tx_hash',
  },
  {
    title: 'tx_type',
    dataIndex: 'tx_type',
    key: 'tx_type',
  },
  {
    title: 'tx_from',
    dataIndex: 'tx_from',
    key: 'tx_from',
  },
  {
    title: 'tx_to',
    dataIndex: 'tx_to',
    key: 'tx_to',
  },
  {
    title: 'tx_amount',
    dataIndex: 'tx_amount',
    key: 'tx_amount',
  },
  {
    title: 'tx_fun',
    dataIndex: 'tx_fun',
    key: 'tx_fun',
  },
  {
    title: 'tx_fun_arg',
    dataIndex: 'tx_fun_arg',
    key: 'tx_fun_arg',
  },
]
const Wrapper = styled.div``
export default function TransactionList() {
  const [dataList, setDataList] = useState<any>([])
  const [modalTitle, setModalTitle] = useState<string>('Modal')
  const [visible, setVisible] = useState<boolean>(false)
  const showModal = useCallback(() => {
    setVisible(true)
  }, [])
  const handleOk = useCallback(() => {
    setVisible(false)
  }, [])
  const handleCancel = useCallback(() => {
    setVisible(false)
  }, [])
  useEffect(() => {
    getTransctionList().then((res) => {
      setDataList(res.data)
    })
  }, [])
  const createFn = useCallback(() => {
    console.log('创建')
  }, [])
  return (
    <Wrapper>
      <Table pagination={false} columns={columns} dataSource={dataList} />
      <Button onClick={showModal}>Open Draggable Modal</Button>
      <Modal footer={null} title={modalTitle} visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <Button type="primary" onClick={createFn}>
          创建
        </Button>
      </Modal>
    </Wrapper>
  )
}
