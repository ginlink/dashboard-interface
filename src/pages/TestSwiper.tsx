/*
 * @Author: jiangjin
 * @Date: 2021-09-08 18:07:12
 * @LastEditTime: 2021-09-13 09:40:24
 * @LastEditors: jiangjin
 * @Description:
 *  测试使用Swiper
 */

import React, { memo } from 'react'
import styled from 'styled-components/macro'
import 'swiper/swiper.min.css'
import { Swiper, SwiperSlide } from 'swiper/react'

function Home() {
  return (
    <>
      <Swiper
        spaceBetween={50}
        slidesPerView={3}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
      </Swiper>
    </>
  )
}

export default memo(Home)
