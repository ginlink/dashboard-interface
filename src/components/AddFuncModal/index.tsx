import { Button, Checkbox, Form, FormInstance, Input, Modal } from 'antd'
import React from 'react'
import styled from 'styled-components/macro'

const Wrapper = styled.div``

export type AddFuncProps = {
  open: boolean
  form: FormInstance
  onDismiss?: () => void
  onSuccess?: () => void
  onFinish?: (values: any) => void
}

export default function AddFuncModal({ open, form, onDismiss, onSuccess, onFinish }: AddFuncProps) {
  // const [form] = Form.useForm()

  return (
    <Wrapper>
      <Modal title="新增Function" visible={open} onCancel={onDismiss} onOk={onSuccess}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="函数" name="function" rules={[{ required: true, message: 'required!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="描述" name="desc">
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Wrapper>
  )
}
