/*
 * @Author: jiangjin
 * @Date: 2021-09-17 15:48:26
 * @LastEditTime: 2021-09-27 17:45:09
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import { TYPE } from '@/theme'
import React from 'react'
import { useTheme } from 'styled-components'
import { AutoColumn } from '../Column'
import Modal, { ModalHeader } from '../Modal'
import { LoadingView } from '../ModalViews'

interface LoadingModelInterface {
  isOpen: boolean
  onDismiss: () => void
}
export default function LoadingModel({ isOpen, onDismiss }: LoadingModelInterface) {
  const theme = useTheme()
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalHeader title={' '} changePadding={true} onDismiss={onDismiss}></ModalHeader>
      <LoadingView>
        <AutoColumn gap={'12px'} justify={'center'}>
          <TYPE.body fontSize={20} color={theme.text8}>
            Waiting For Confirmation
          </TYPE.body>
        </AutoColumn>
      </LoadingView>
    </Modal>
  )
}
