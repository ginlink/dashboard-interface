import React from 'react'

import styled, { css, keyframes } from 'styled-components'

import logo from '@/assets/images/logo_sm_white_bg.svg'

const pulse = keyframes`
  0% { transform: scale(1); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

const Wrapper = styled.div<{ fill: number; height?: string; full?: boolean }>`
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, fill }) => (fill ? 'black' : theme.bg0)};
  height: 100%;
  width: 100%;
  ${(props) =>
    props.full
      ? css`
          height: 100vh;
        `
      : props.fill && !props.height
      ? css`
          height: 100vh;
        `
      : css`
          height: 180px;
        `}
`

const AnimatedImg = styled.div`
  animation: ${pulse} 800ms linear infinite;
  & > * {
    width: 72px;
  }
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const StyledSVG = styled.svg<{ size: string; stroke?: string }>`
  animation: 2s ${rotate} linear infinite;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  path {
    stroke: ${({ stroke, theme }) => stroke ?? theme.primary1};
  }
`

export const LocalLoader = ({ fill, full }: { fill: boolean; full?: boolean }) => {
  return (
    <Wrapper fill={fill ? 1 : 0} full={full}>
      <AnimatedImg>
        <img src={logo} alt="loading-icon" />
      </AnimatedImg>
    </Wrapper>
  )
}

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export default function Loader({
  size = '16px',
  stroke,
  ...rest
}: {
  size?: string
  stroke?: string
  [k: string]: any
}) {
  return (
    <StyledSVG viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" size={size} stroke={stroke} {...rest}>
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </StyledSVG>
  )
}

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`
