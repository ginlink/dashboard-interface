/*
 * @Author: jiangjin
 * @Date: 2021-09-02 16:15:41
 * @LastEditTime: 2021-09-27 18:50:23
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import React from 'react'
import styled from 'styled-components/macro'

import { Modal as Modald } from 'antd'
import { RowBetween } from '../Row'
const ContentWrapper = styled.div<{ minHeight: number | false; maxHeight: string | false; radius: number }>`
  min-height: ${(props) => props.minHeight && props.minHeight + 'px'};
  max-height: ${(props) => props.maxHeight && props.maxHeight};

  padding: 0;
  /* overflow-y: scroll; */
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0 !important;
  }
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;

  background-color: ${(props) => props.theme.black};
  color: ${(props) => props.theme.white};

  box-shadow: 0px 2px 23px 0px rgba(197, 201, 213, 0.2);
  border-radius: ${(props) => props.radius && props.radius + 'px'};
`
const Header = styled(RowBetween)<{ changePadding?: boolean }>`
  padding: ${({ changePadding }) => (changePadding ? '1rem;' : '0')};
  svg {
    cursor: pointer;
  }
`
const Name = styled.div`
  font-size: 15px;
  line-height: 21px;
`
import { CloseCircleOutlined } from '@ant-design/icons'

export function ModalHeader({
  title,
  onDismiss,
  changePadding,
}: {
  title: string | undefined
  onDismiss?: () => void
  changePadding?: boolean
}) {
  return (
    <Header changePadding={changePadding}>
      <Name>{title}</Name>
      <CloseCircleOutlined onClick={onDismiss} />
    </Header>
  )
}

export interface ModalProps {
  isOpen: boolean
  onDismiss?: () => void
  minHeight?: number | false
  maxHeight?: string | false
  children?: React.ReactNode
  radius?: number
}
export default function Modal({
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight = '90vh',
  children,
  radius = 15,
}: ModalProps) {
  return (
    <Modald visible={isOpen} closable={false} onCancel={onDismiss} footer={null} wrapClassName={'ant-modal-wrapper'}>
      <ContentWrapper minHeight={minHeight} maxHeight={maxHeight} radius={radius}>
        {children}
      </ContentWrapper>
    </Modald>
  )
}
