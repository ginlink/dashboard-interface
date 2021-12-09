import React from 'react'
import styled from 'styled-components/macro'
import { lighten } from 'polished'

import { Modal as Modald } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'

import { RowBetween } from '../Row'
import { ButtonPrimary } from '../Button'
import { isMobile } from 'react-device-detect'
import { MEDIUM, px2vwm } from '@/utils/adapteH5'

export const ModalWrapper = styled.div`
  min-width: 475px;
  max-width: 475px;
  padding: 26px 30px;
  @media (max-width: ${MEDIUM}) {
    padding: 15px 15px;

    min-width: 320px;
    max-width: 320px;
  }
`

export const ModalButtonPrimary = styled(ButtonPrimary)`
  width: 100%;
  font-size: 16px;
  line-height: 22px;
  padding: 10px 0;
  border-radius: 42px;
  color: ${(props) => lighten(0.05, props.theme.black)};

  @media (max-width: ${MEDIUM}) {
    font-size: 13px;
    line-height: 19px;
    padding: 8px 0;
    border-radius: 32px;
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;

  @media (max-width: ${MEDIUM}) {
    margin-top: 25px;
  }
`
export const ButtonItem = styled.div`
  margin-top: 20px;
  &:first-child {
    margin-top: 0;
  }

  @media (max-width: ${MEDIUM}) {
    margin-top: 12px;
  }
`

const closeIconSize = isMobile ? px2vwm(15) : '20px'

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
      <CloseCircleOutlined onClick={onDismiss} style={{ fontSize: closeIconSize }} />
    </Header>
  )
}

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

  /* background-color: ${(props) => props.theme.black}; */
  /* color: ${(props) => props.theme.white}; */

  /* box-shadow: 0px 2px 23px 0px rgba(197, 201, 213, 0.2); */
  border-radius: ${(props) => props.radius && props.radius + 'px'};
`

const Header = styled(RowBetween)<{ changePadding?: boolean }>`
  padding: ${({ changePadding }) => (changePadding ? '1rem;' : '0')};
  svg {
    cursor: pointer;
  }
`

const Name = styled.div`
  font-size: 20px;
  line-height: 28px;

  @media (max-width: ${MEDIUM}) {
    font-size: 15px;
    line-height: 21px;
  }
`

export type ModalProps = {
  isOpen: boolean
  onDismiss?: () => void
  minHeight?: number | false
  maxHeight?: string | false
  children?: React.ReactNode
  radius?: number
  width?: number
}

export default function Modal({ isOpen, onDismiss, children, width = 520 }: ModalProps) {
  return (
    <Modald
      visible={isOpen}
      closable={false}
      onCancel={onDismiss}
      footer={null}
      wrapClassName={'ant-modal-wrapper'}
      width={width}
      style={{ borderRadius: '30px' }}
    >
      {children}
    </Modald>
  )
}
