import { NETWORK_LABELS } from '@/constants/chains'
import { useActiveWeb3React } from '@/hooks/web3'
import { TYPE } from '@/theme'
import { borderRadius } from 'polished'
import React, { memo } from 'react'
import styled, { useTheme } from 'styled-components/macro'
import Row from '../Row'
import Web3Status from '../Web3Status'

const Wrapper = styled(Row)`
  gap: 8px;
`

const EnsWrapper = styled.div`
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.yellow1};
  border-radius: 4px;
`

function HeaderPC() {
  const { chainId } = useActiveWeb3React()

  return (
    <Wrapper>
      <EnsWrapper>
        <TYPE.main>{NETWORK_LABELS[chainId ?? -1] ?? 'ErrorNetWork'}</TYPE.main>
      </EnsWrapper>

      <Web3Status />
    </Wrapper>
  )
}

export default memo(HeaderPC)
