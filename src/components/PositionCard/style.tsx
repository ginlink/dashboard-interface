import { MEDIUM } from '@/utils/adapteH5'
import styled from 'styled-components/macro'

export const PositionCardWarpper = styled.div`
  width: 100%;
  background: ${(props) => props.theme.black};
  box-shadow: 0px 1px 26px 0px ${(props) => props.theme.boxShadow1};
  border-radius: 15px;
  padding: 18px;
  margin-top: 22px;
`
export const Title = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${(props) => props.theme.white};
  margin-bottom: 18px;
`
export const Empty = styled.div`
  text-align: center;
  margin-top: 18px;
  @media (max-width: ${MEDIUM}) {
    margin-top: 0px;
  }
  img {
    width: 12px;
    height: 12px;
    margin-right: 3px;
  }
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.text8};
`
