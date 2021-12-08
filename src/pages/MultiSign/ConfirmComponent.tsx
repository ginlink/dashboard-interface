import React from 'react'
import styled from 'styled-components/macro'
import { Input, Space, Select } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { OwnerType } from '.'
const { Option } = Select
const ConfirmWrapper = styled.div`
  .select-style {
    width: 120px;
  }
  .space-style {
    display: flex;
    flex-direction: row;
    padding: 18px;
    border: 1px solid rgb(232, 231, 230);
    border-left: 0;
    border-right: 0;
    color: rgb(93, 109, 116);
    margin-bottom: 16px;
    .ant-space-item:first-child {
      width: 30%;
    }
    .ant-space-item:nth-child(2) {
      flex: 1;
    }
  }
  .input-style {
    display: flex;
    flex-direction: row;
    padding-left: 18px;
    margin-bottom: 12px;
    .ant-space-item:first-child {
      width: 30%;
    }
    .ant-space-item:nth-child(2) {
      flex: 1;
    }
  }
`
const AddressBox = styled.div`
  display: flex;
  align-items: center;
  .deleteIcon {
    margin-left: 18px;
  }
`
const InputBox = styled.div``
const HeaderItem = styled.div``
const ErrorBox = styled.div`
  padding-left: 32%;
  color: red;
`
const AddOwner = styled.div`
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  color: #1990ff;
  width: max-content;
  margin: 0 auto;
  margin-top: 24px;
  margin-bottom: 24px;
`
const SelectTitle = styled.span`
  margin-left: 18px;
`
type ConfirmComponentType = {
  ownerList: Array<OwnerType>
  changeOwnerName: (e: any, index: number) => void
  changeOwnerAddress: (e: any, index: number) => void
  deleteOwner: (index: number) => void
  handleChange: (e: any) => void
  addOwner: () => void
  ownerNum: Array<number>
  confrimNum: number
}
export default function ConfirmComponent({
  ownerList,
  changeOwnerName,
  changeOwnerAddress,
  deleteOwner,
  addOwner,
  ownerNum,
  confrimNum,
  handleChange,
}: ConfirmComponentType) {
  return (
    <ConfirmWrapper>
      <Space direction="vertical" className="space-style">
        <HeaderItem>业主姓名</HeaderItem>
        <HeaderItem>业主地址</HeaderItem>
      </Space>
      {ownerList.map((v, index) => (
        <InputBox key={index}>
          <Space direction="vertical" className="input-style">
            <Input
              placeholder="业主姓名"
              value={v.ownerName}
              onChange={(e) => changeOwnerName(e, index)}
              size="large"
            />
            <AddressBox>
              <Input
                placeholder="业主地址"
                value={v.ownerAddress}
                onChange={(e) => changeOwnerAddress(e, index)}
                size="large"
              />
              {index > 0 && (
                <DeleteOutlined
                  style={{ fontSize: '20px', color: '#BFBFBF', cursor: 'pointer' }}
                  className="deleteIcon"
                  onClick={() => deleteOwner(index)}
                />
              )}
            </AddressBox>
          </Space>
          {v.errorMsg && <ErrorBox>{v.errorMsg}</ErrorBox>}
        </InputBox>
      ))}
      <AddOwner onClick={addOwner}>+ 添加另一个所有者</AddOwner>
      <SelectTitle>所有者：</SelectTitle>
      {ownerNum.length && (
        <Select defaultValue={confrimNum} className="select-style" onChange={handleChange}>
          {ownerNum.map((v: number, flag: number) => (
            <Option value={v} key={flag}>
              {v}
            </Option>
          ))}
        </Select>
      )}
    </ConfirmWrapper>
  )
}
