import React, { useState, useEffect, createRef, useCallback, useRef } from 'react'
import styled from 'styled-components/macro'
import { Table, Tag, Space } from 'antd'
import { getTransctionList } from '@/services/api'
import { Modal, Button } from 'antd'

const Wrapper = styled.div``
export default function TransactionList() {
  const [dataList, setDataList] = useState<any>([])
  const [modalTitle, setModalTitle] = useState<string>('Modal')
  const [visible, setVisible] = useState<boolean>(false)
  const columns = [
    {
      title: '事务ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '授权hash',
      dataIndex: 'tx_hash',
      key: 'tx_hash',
    },
    {
      title: '事务类型',
      dataIndex: 'tx_type',
      key: 'tx_type',
    },
    {
      title: 'from',
      dataIndex: 'tx_from',
      key: 'tx_from',
    },
    {
      title: 'to',
      dataIndex: 'tx_to',
      key: 'tx_to',
    },
    {
      title: '数量',
      dataIndex: 'tx_amount',
      key: 'tx_amount',
    },
    {
      title: '方法',
      dataIndex: 'tx_fun',
      key: 'tx_fun',
    },
    {
      title: '方法参数',
      dataIndex: 'tx_fun_arg',
      key: 'tx_fun_arg',
    },
    // {
    //   title: 'operation',
    //   dataIndex: 'operation',
    //   render: (_: any, record: { key: React.Key }) => (
    //     <Button
    //       type="primary"
    //       onClick={() => {
    //         setVisible(true)
    //         console.log('operation', record)
    //       }}
    //     >
    //       operation
    //     </Button>
    //   ),
    // },
  ]
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
      {/* <Button onClick={showModal}>Open Draggable Modal</Button> */}
      {/* <Modal footer={null} title={modalTitle} visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <Button type="primary" onClick={createFn}>
          创建
        </Button>
      </Modal> */}
    </Wrapper>
  )
}
