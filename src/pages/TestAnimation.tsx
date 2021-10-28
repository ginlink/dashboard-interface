/*
 * @Author: jiangjin
 * @Date: 2021-09-25 11:06:04
 * @LastEditTime: 2021-09-25 17:14:32
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import React, { memo, useRef, useState } from 'react'
import { useSpring, animated, config } from 'react-spring'
import styled from 'styled-components/macro'

function TestAnimation() {
  const { o, xyz, color } = useSpring({
    from: { o: 0, xyz: [0, 0, 0], color: 'red' },
    o: 1,
    xyz: [10, 20, 5],
    color: 'green',
  })

  return null
  // <animated.div
  //   style={{
  //     // If you can, use plain animated values like always, ...
  //     // You would do that in all cases where values "just fit"
  //     color,
  //     // Unless you need to interpolate them
  //     background: o.to((o) => `rgba(210, 57, 77, ${o})`),
  //     // Which works with arrays as well
  //     transform: xyz.to((x, y, z) => `translate3d(${x}px, ${y}px, ${z}px)`),
  //     // If you want to combine multiple values use the "interpolate" helper
  //     // You can also form ranges, even chain multiple interpolations
  //     padding: o.to({ range: [0, 0.5, 1], output: [0, 0, 10] }).to((o) => `${o}%`),
  //     // Interpolating strings (like up-front) through ranges is allowed ...
  //     borderColor: o.to({ range: [0, 1], output: ['red', '#ffaabb'] }),
  //     // There's also a shortcut for plain, optionless ranges ...
  //     opacity: o.to([0.1, 0.2, 0.6, 1], [1, 0.1, 0.5, 1]),
  //   }}
  // >
  //   {o.to((n) => n.toFixed(2)) /* innerText interpolation ... */}
  // </animated.div>
}

export default memo(TestAnimation)
