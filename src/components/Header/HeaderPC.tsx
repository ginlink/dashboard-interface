import { NETWORK_LABELS } from '@/constants/chains'
import { useActiveWeb3React } from '@/hooks/web3'
import { TYPE } from '@/theme'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components/macro'
import Row from '../Row'
import Web3Status from '../Web3Status'
import { useHistory } from 'react-router-dom'

const Wrapper = styled(Row)`
  gap: 8px;
`

const EnsWrapper = styled.div`
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.yellow1};
  border-radius: 4px;
`
const LoginOut = styled.div`
  cursor: pointer;
`
function HeaderPC() {
  const history = useHistory()
  const { chainId } = useActiveWeb3React()
  const loginOutFn = useCallback(() => {
    console.log('loginOutFn')
    history.push('/login')
    sessionStorage.removeItem('auth')
  }, [history])
  return (
    <Wrapper>
      <EnsWrapper>
        <TYPE.main>{NETWORK_LABELS[chainId ?? -1] ?? 'ErrorNetWork'}</TYPE.main>
      </EnsWrapper>
      <Web3Status />
      <LoginOut onClick={loginOutFn}>登出</LoginOut>
    </Wrapper>
  )
}

export default memo(HeaderPC)
