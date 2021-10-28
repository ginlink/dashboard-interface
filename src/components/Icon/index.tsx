/*
 * @Author: zhangyang
 * @Date: 2021-09-01 15:15:34
 * @LastEditTime: 2021-09-17 21:15:03
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import React from 'react'
import Icon from '@ant-design/icons'
import { ReactComponent as home } from '../../assets/images/sider/home.svg'
import { ReactComponent as set } from '../../assets/images/sider/set.svg'
import { ReactComponent as single } from '../../assets/images/sider/single.svg'
import { ReactComponent as chart } from '../../assets/images/sider/chart.svg'
import { ReactComponent as lang } from '../../assets/images/sider/lang.svg'
import { ReactComponent as liquidity } from '../../assets/images/sider/liquidity.svg'
import { ReactComponent as logo } from '../../assets/images/logo.svg'
import { ReactComponent as moon } from '../../assets/images/sider/moon.svg'
import { ReactComponent as more } from '../../assets/images/sider/more.svg'
import { ReactComponent as pool } from '../../assets/images/sider/pool.svg'
import { ReactComponent as profile } from '../../assets/images/sider/profile.svg'
import { ReactComponent as swap } from '../../assets/images/sider/swap.svg'
import { ReactComponent as trade } from '../../assets/images/sider/trade.svg'
import { ReactComponent as wallet } from '../../assets/images/header/wallet.svg'
import styled from 'styled-components/macro'
import bnbToken from '@/assets/images/bnb-token.png'

export function Home() {
  return <Icon component={home} />
}
export function Chart() {
  return <Icon component={chart} />
}
export function Lang() {
  return <Icon component={lang} />
}
export function Liquidity() {
  return <Icon component={liquidity} />
}
export function Logo() {
  return <Icon component={logo} />
}
export function Moon() {
  return <Icon component={moon} />
}
export function Pool() {
  return <Icon component={pool} />
}
export function Profile() {
  return <Icon component={profile} />
}
export function Swap() {
  return <Icon component={swap} />
}
export function More() {
  return <Icon component={more} />
}
export function Trade() {
  return <Icon component={trade} />
}
export function Set() {
  return <Icon component={set} />
}
export function Single() {
  return <Icon component={single} />
}
export function Wallet() {
  return <Icon component={wallet} />
}

const IconBase = styled.div<{ iconUrl: string }>`
  background: url(${(props) => props.iconUrl}) no-repeat;
  background-size: 100% 100%;
  width: 20px;
  height: 20px;
`
const BNBIcon = styled(IconBase)`
  width: 26px;
  height: 26px;
  flex: none;
`

export function TokenIcon({ icon }: { icon?: string | undefined }) {
  return <BNBIcon iconUrl={icon ?? bnbToken} />
}

// TODO 1.封装单币、双币的Icon
