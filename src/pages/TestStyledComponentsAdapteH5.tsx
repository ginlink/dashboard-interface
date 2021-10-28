/*
 * @Author: jiangjin
 * @Date: 2021-09-04 16:21:19
 * @LastEditTime: 2021-09-13 09:40:56
 * @LastEditors: jiangjin
 * @Description:
 *  测试适配H5页面的新函数
 */

import React from 'react'
import styled, { css } from 'styled-components'
import { t } from './adapteH5'

const DEFAULT_WIDTH = '100px'

const Wrapper = styled.div<{ width: string }>`
  width: 300px;
  border: 1px solid red;
  height: 200px;

  width: 200px;
  height: 100px;

  @media (max-width: 968px) {
    width: 100px;
    height: ${DEFAULT_WIDTH};
  }
`

const Wrapper1 = styled.div<{ width: string }>`
  width: 300px;
  @media (max-width: 2000px) {
    width: 100px;
    width: 20px;

    width: 200px;
  }
`

console.debug('[Wrapper]:', Wrapper)

/* ${t`
    @media (max-width: 2000px){
      width: 100px;
      height: 200px;
      
      border: 1px solid red;
    }
    `} */
// height: ${(props: any) => props.width};

export default function TestStyledComponentsAdapteH5() {
  return <Wrapper width={'500px'}>TestStyledComponentsAdapteH5</Wrapper>
}
