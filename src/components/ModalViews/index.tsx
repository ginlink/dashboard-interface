import React from 'react'
import styled, { useTheme } from 'styled-components'
import { AutoColumn, ColumnCenter } from '../Column'
import { TYPE, CustomLightSpinner } from '../../theme'
import Circle from '../../assets/images/blue-loader.svg'
import { MEDIUM, px2vwm } from '@/utils/adapteH5'
const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 20px 100px 24px 100px;
  @media (max-width: ${MEDIUM}) {
    padding: 0 ${px2vwm('30px')} ${px2vwm('30px')} ${px2vwm('30px')};
  }
`
const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

export function LoadingView({ children, tip = '' }: { children: any; tip?: string }) {
  const theme = useTheme()
  return (
    <ConfirmOrLoadingWrapper>
      <ConfirmedIcon>
        <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
      </ConfirmedIcon>
      <AutoColumn gap="10px" justify={'center'}>
        {children}
        {tip && (
          <TYPE.body fontSize={16} color={theme.text8}>
            {tip}
          </TYPE.body>
        )}
        <TYPE.small fontSize={12} color={theme.text8}>
          Confirm this transaction in your wallet
        </TYPE.small>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}
