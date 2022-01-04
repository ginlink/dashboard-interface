import React, { useCallback, useEffect, useState } from 'react'
import { Form, Input, Button, Select, Modal, Spin, message } from 'antd'
import { setSheepHomeStatus, sheepHomeStatus, SheepHomeStatusParams } from '@/services/api'
import styled from 'styled-components'
const { Option } = Select

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}
const SelectWarpper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 480px;
`
const SelectText = styled.div``

const ButtonWarpper = styled.div`
  display: flex;
  justify-items: center;
`
const SelectButton = styled.div`
  margin-left: 10px;
`

type stautsParameter = {
  home_status: string
  last_version: string
}
export default function SheepConifg() {
  function handleChange(value: any) {
    console.log(`selected ${value}`)
  }
  const [sheepStaus, setSheepStaus] = useState<stautsParameter | undefined>(undefined)

  const [spinning, setSpinning] = useState(true)
  const [form] = Form.useForm()

  const [isDisabled, seIsDisabled] = useState<boolean>(true)
  const homeStatus = useCallback(() => {
    sheepHomeStatus()
      .then((res: any) => {
        setSheepStaus(res)
      })
      .catch(() => {
        message.error('系统错误')
      })
    setSpinning(false)
  }, [])

  const onFinish = async (values: SheepHomeStatusParams) => {
    setSpinning(true)
    try {
      const res = await setSheepHomeStatus(values)
      console.log('onFinish', res)
      homeStatus()
      seIsDisabled(true)
      message.success('修改成功')
    } catch (error) {
      console.log('error', error)
      message.error('错误')
    }
    setSpinning(false)
  }

  useEffect(() => {
    homeStatus()
  }, [homeStatus])

  const statusType = (value: string | undefined) => {
    if (value == undefined) return ''
    switch (value) {
      case '0':
        return '直接进入'
        break
      case '1':
        return '升级中'
        break
      case '2':
        return '维护中'
        break
      default:
        return '-'
        break
    }
  }
  const Froms = ({ sheepStaus }: { sheepStaus?: stautsParameter }) => {
    return (
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="lastversion" label="版本" rules={[{ required: true, message: '请输入版本号' }]}>
          <Input disabled={isDisabled} placeholder={'当前版本：' + sheepStaus?.last_version} />
        </Form.Item>
        <Form.Item name="homestatus" label="配置" rules={[{ required: true, message: '请选择配置' }]}>
          <Select
            placeholder={'当前配置：' + statusType(sheepStaus?.home_status)}
            onChange={handleChange}
            disabled={isDisabled}
          >
            <Option value="0">直接进入</Option>
            <Option value="1">升级中</Option>
            <Option value="2">维护中</Option>
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <ButtonWarpper>
            <SelectButton>
              <Button disabled={!isDisabled} onClick={() => seIsDisabled(false)}>
                修改
              </Button>
            </SelectButton>
            <SelectButton>
              <Button disabled={isDisabled} type="primary" htmlType="submit">
                确认
              </Button>
            </SelectButton>
          </ButtonWarpper>
        </Form.Item>
      </Form>
    )
  }
  return (
    <>
      <Spin tip="Loading..." spinning={spinning}>
        <SelectWarpper>
          <Froms sheepStaus={sheepStaus}></Froms>
        </SelectWarpper>
      </Spin>
    </>
  )
}
