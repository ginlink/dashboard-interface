import React from 'react'
import styled from 'styled-components/macro'
import { OwnerType } from '.'

const ReviewWrapper = styled.div`
  display: flex;
`
const Item = styled.div`
  margin-bottom: 14px;
`
const Title = styled.div`
  color: #5d6d74;
  margin-bottom: 8px;
`
const Content = styled.div`
  color: #001428;
  font-weight: 500;
`
const OwnerContent = styled.div`
  color: #001428;
  margin-bottom: 8px;
`
const OwnerBox = styled.div`
  padding: 10px 0;
  border: 1px solid rgb(232, 231, 230);
  border-left: 0;
  border-right: 0;
`
const LeftBox = styled.div`
  width: 26%;
  border-right: 1px solid rgb(232, 231, 230);
  .left-item-style {
    margin-bottom: 40px;
  }
`
const RightBox = styled.div`
  flex: 1;
  .right-item-style {
    padding-left: 18px;
  }
  .right-item-title {
    margin-bottom: 24px;
  }
`
type ReviewComponentType = {
  nameValue: any
  ownerList: Array<OwnerType>
  confrimNum: number
}
export default function ReviewComponent({ nameValue, ownerList, confrimNum }: ReviewComponentType) {
  return (
    <ReviewWrapper>
      <LeftBox>
        <Item className="left-item-style">
          <Title>保险箱名称</Title>
          <Content>{nameValue}</Content>
        </Item>
        <Item className="left-item-style">
          <Title>交易确认数</Title>
          <Content>{confrimNum}</Content>
        </Item>
      </LeftBox>
      <RightBox>
        <Item>
          <Title className="right-item-style right-item-title">所有者({ownerList.length})</Title>
          {ownerList.map((v, index) => {
            return (
              <OwnerBox key={index}>
                <OwnerContent className="right-item-style">{v.ownerName}</OwnerContent>
                <OwnerContent className="right-item-style">{v.ownerAddress}</OwnerContent>
              </OwnerBox>
            )
          })}
        </Item>
      </RightBox>
    </ReviewWrapper>
  )
}
