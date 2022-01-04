import { Form, FormInstance, Input, Modal } from 'antd'
import React, { HtmlHTMLAttributes } from 'react'
import styled from 'styled-components/macro'

const Wrapper = styled.div``

export type AddAddressModalProps = {
  open: boolean
  form: FormInstance
  updateId?: number
  onDismiss?: () => void
  onSuccess?: () => void
  onFinish?: (values: any) => void
}

export default function AddAddressModal({
  open,
  form,
  onDismiss,
  onSuccess,
  onFinish,
  updateId = 0,
  ...rest
}: AddAddressModalProps & HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <Wrapper {...rest}>
      <Modal title={updateId ? '更新' : '新增'} visible={open} onCancel={onDismiss} onOk={onSuccess}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item label="chainId" name="chainId" rules={[{ required: true, message: 'required!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="address" name="address" rules={[{ required: true, message: 'required!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="decimals" name="decimals">
            <Input />
          </Form.Item>

          <Form.Item label="symbol" name="symbol">
            <Input />
          </Form.Item>

          <Form.Item label="logoURI" name="logoURI">
            <Input />
          </Form.Item>

          <Form.Item label="描述" name="desc">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Wrapper>
  )
}
