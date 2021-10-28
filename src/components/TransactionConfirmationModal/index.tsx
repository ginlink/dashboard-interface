import React, { ReactNode, useContext } from 'react'
import { Currency } from 'plugins/@uniswap/sdk-core'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn, ColumnCenter } from '../Column'
import { RowBetween } from '../Row'
import { Text } from 'rebass'
import { CloseIcon } from '../../theme/components'
import { ExternalLink } from '../../theme'
import { AlertTriangle, ArrowUpCircle } from 'react-feather'
import { ButtonPrimary } from '../Button'
import Modal, { ModalHeader } from '../Modal'
import { MEDIUM } from '@/utils/adapteH5'
import { useActiveWeb3React } from '../../hooks/web3'
import useAddTokenToMetamask from '@/hooks/useAddTokenToMetamask'
import { ExplorerDataType, getExplorerLink } from '@/utils/getExplorerLink'

const Wrapper = styled.div`
  width: 50vw;
  max-width: 420px;
  max-height: 90vh;
  padding: 1rem;
  @media (max-width: ${MEDIUM}) {
    width: 88vw;
  }
`
const Section = styled(AutoColumn)<{ inline?: boolean }>`
  padding: ${({ inline }) => (inline ? '0' : '0')};
`
const BottomSection = styled(Section)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`
const ConfirmedIcon = styled(ColumnCenter)<{ inline?: boolean }>`
  padding: ${({ inline }) => (inline ? '20px 0' : '10px 0;')};
`

export function TransactionErrorContent({
  message,
  onDismiss,
  isOpen,
}: {
  message: ReactNode
  onDismiss: () => void
  isOpen: boolean
}) {
  const theme = useContext(ThemeContext)
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalHeader title={'Error'} changePadding={true} onDismiss={onDismiss}></ModalHeader>
      <Wrapper>
        <Section>
          <AutoColumn style={{ marginTop: 20, padding: '2rem 0' }} gap="24px" justify="center">
            <AlertTriangle color={theme.red1} style={{ strokeWidth: 1.5 }} size={64} />
            <Text
              fontWeight={500}
              fontSize={16}
              color={theme.red1}
              style={{ textAlign: 'center', width: '85%', wordBreak: 'break-word' }}
            >
              {message}
            </Text>
          </AutoColumn>
        </Section>
        <BottomSection gap="12px">
          <ButtonPrimary onClick={onDismiss}>Dismiss</ButtonPrimary>
        </BottomSection>
      </Wrapper>
    </Modal>
  )
}

export function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
  inline,
  isOpen,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: number
  currencyToAdd?: Currency | undefined
  inline?: boolean // not in modal
  isOpen: boolean
}) {
  const theme = useContext(ThemeContext)

  const { library } = useActiveWeb3React()

  const { addToken, success } = useAddTokenToMetamask(currencyToAdd)

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalHeader title={' '} changePadding={true} onDismiss={onDismiss}></ModalHeader>
      <Wrapper>
        <Section inline={inline}>
          <ConfirmedIcon inline={inline}>
            <ArrowUpCircle strokeWidth={0.5} size={inline ? '40px' : '90px'} color={theme.primary1} />
          </ConfirmedIcon>
          <AutoColumn gap="12px" justify={'center'}>
            <Text fontWeight={500} fontSize={20} textAlign="center">
              Transaction Submitted
            </Text>
            {chainId && hash && (
              <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}>
                <Text fontWeight={500} fontSize={14} color={theme.primary1}>
                  View on Explorer
                </Text>
              </ExternalLink>
            )}

            <ButtonPrimary onClick={onDismiss} style={{ margin: '20px 0 0 0' }}>
              <Text fontWeight={500} fontSize={20}>
                Close
              </Text>
            </ButtonPrimary>
          </AutoColumn>
        </Section>
      </Wrapper>
    </Modal>
  )
}
