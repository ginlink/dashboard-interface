import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react'
import { Tabs } from 'antd'
import { HomePositionCardWarpper, MyNavLink, PositionCardBox, ScrollableRow } from './style'
import more from '../../assets/images/home/more.svg'
import { collapseTypes } from '@/constants/collapseType'
import PositionCard from './PositionCard'
import EmptyShowImg from '../EmptyShowImg'
import 'swiper/swiper.min.css'
import styled from 'styled-components/macro'
import { darken } from 'polished'

import SwiperCore, { Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperClass from 'swiper/types/swiper-class'
import { MEDIUM } from '@/utils/adapteH5'
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'

const { TabPane } = Tabs

const TabsWrapper = styled.div``
const TabsHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .tab-header-active {
    background-color: ${(props) => props.theme.black};
    border-radius: 12px 12px 0 0;
  }

  @media (max-width: ${MEDIUM}) {
    width: 100%;
    justify-content: space-between;
  }
`
const TabHeaderItem = styled.div`
  width: 121px;
  font-size: 12px;
  line-height: 17px;

  padding: 11px 18px;
  padding-left: 30px;
  text-align: center;

  cursor: pointer;

  transition: background 0.3s ease-in;

  &:first-child {
    margin-left: unset;
  }
  @media (max-width: ${MEDIUM}) {
    width: unset;
    flex: 1;
  }
`
const TabsContent = styled.div`
  background-color: ${(props) => props.theme.black};
  box-shadow: 0px 2px 26px 0px ${(props) => darken(0.2, props.theme.black)};

  padding: 31px 23px 0;
  border-radius: 0 20px 20px 20px;
  @media (max-width: ${MEDIUM}) {
    border-radius: 0 0 12px 12px;
    padding: 15px 15px 0;
  }
`
const SwiperWrapper = styled.div``
const LinkWrapper = styled.div`
  padding: 17px 0 22px;
  @media (max-width: ${MEDIUM}) {
    padding: 11px 0 15px;
  }
`

const tabs = [
  { name: '聚合流动性', key: '1' },
  { name: '单币挖矿', key: '2' },
  { name: '流动性挖矿', key: '3' },
]
const singleArr = [
  { id: 1, lp_name: 'ETH', apr: '24.81' },
  { id: 2, lp_name: 'ETH', apr: '24.81' },
  { id: 3, lp_name: 'ETH', apr: '24.81' },
  { id: 4, lp_name: 'ETH', apr: '24.81' },
  { id: 5, lp_name: 'ETH', apr: '24.81' },
  { id: 6, lp_name: 'ETH', apr: '24.81' },
  { id: 6, lp_name: 'ETH', apr: '24.81' },
  { id: 6, lp_name: 'ETH', apr: '24.81' },
  { id: 6, lp_name: 'ETH', apr: '24.81' },
] as any
const liquidityArr = [
  { id: 1, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 2, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 3, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 4, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 5, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 6, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 6, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 6, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 6, lp_name: 'ETH-BUSD', apr: '24.81' },
] as any
const polymerizationFluidity = [
  { id: 1, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 2, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 3, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 4, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 5, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 6, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 6, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 6, lp_name: 'ETH-BUSD', apr: '24.81' },
  { id: 6, lp_name: 'ETH-BUSD', apr: '24.81' },
] as any

SwiperCore.use([Autoplay])
export default function HomePositionCard({ changeFn }: { changeFn: (key: string) => void }) {
  // const [activeKey, setActiveKey] = useState('1')

  const poIncreaseRef = useRef<HTMLDivElement>(null)
  // const [liIncreaseRef, setLiIncreaseRef] = useState<any>()
  // const [singleIncreaseRef, setSingleIncreaseRef] = useState<any>()
  const [singleIncreaseSet, setSingleIncreaseSet] = useState(false)
  const [poIncreaseSet, setPoIncreaseSet] = useState(false)
  const [liIncreaseSet, setLiIncreaseSet] = useState(false)

  console.log('[渲染次数]:')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // let count = 0
  // //3秒自动切换tab标签组件
  // const swiperTab = useCallback(() => {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   if (count === tabs.length) count = 0
  //   setActiveKey(tabs[count].key)
  //   count++
  // }, [activeKey, count])
  // let tempTimeId = null as any
  // useEffect(() => {
  //   const time = setInterval(swiperTab, 3000)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   tempTimeId = time
  //   return () => {
  //     clearInterval(time)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])
  // const tabClick = useCallback(
  //   (key) => {
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     count = tabs.findIndex((v) => v.key === key)
  //     clearInterval(tempTimeId)
  //     setActiveKey(key)
  //     changeFn(key)
  //     if (key === '3') {
  //       setLiIncreaseSet(false)
  //     }
  //   },
  //   [changeFn]
  // )

  //轮播
  // useEffect(() => {
  //   if (!poIncreaseSet && poIncreaseRef && poIncreaseRef.current) {
  //     setInterval(() => {
  //       if (poIncreaseRef.current && poIncreaseRef.current.scrollLeft !== poIncreaseRef.current.scrollWidth) {
  //         poIncreaseRef.current.scrollTo(poIncreaseRef.current.scrollLeft + 1, 0)
  //       }
  //     }, 30)
  //     setPoIncreaseSet(true)
  //   }
  // }, [poIncreaseRef, poIncreaseSet, setPoIncreaseSet])
  // useEffect(() => {
  //   if (!liIncreaseSet && liIncreaseRef) {
  //     setInterval(() => {
  //       if (liIncreaseRef && liIncreaseRef.scrollLeft !== liIncreaseRef.scrollWidth) {
  //         liIncreaseRef.scrollTo(liIncreaseRef.scrollLeft + 1, 0)
  //       }
  //     }, 30)
  //     setLiIncreaseSet(true)
  //   }
  // }, [liIncreaseSet, liIncreaseRef, setLiIncreaseSet])
  // useEffect(() => {
  //   if (!singleIncreaseSet && singleIncreaseRef) {
  //     setInterval(() => {
  //       if (singleIncreaseRef && singleIncreaseRef.scrollLeft !== singleIncreaseRef.scrollWidth) {
  //         singleIncreaseRef.scrollTo(singleIncreaseRef.scrollLeft + 1, 0)
  //       }
  //     }, 30)
  //     setSingleIncreaseSet(true)
  //   }
  // }, [singleIncreaseSet, singleIncreaseRef, setSingleIncreaseSet])

  // 引用swiper实例
  const swiperRef = useRef<SwiperClass | undefined>(undefined)

  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0)
  const currentTabIndexRef = useRef<number>(0)
  const tabsClick = useCallback((index: number) => {
    swiperRef.current?.slideTo(index)
  }, [])

  const isPc = useIsPcByScreenWidth()

  // 限制展示个数
  const positionLimit = useMemo(() => (isPc ? 5 : 3), [isPc])

  const divRef = useRef<HTMLDivElement>(null)
  const scrollRefs = useMemo(() => [divRef, divRef, divRef], [])

  // TODO 待完善
  // useEffect(() => {
  //   if (!swiperRef.current) return

  //   let startScroll: number, touchStart: number, touchCurrent: number

  //   swiperRef.current.slides.on(
  //     'touchstart',
  //     function (e: Event) {
  //       // console.log('[e](currentTabIndex):', currentTabIndex)
  //       if (!swiperRef.current) return

  //       const that = swiperRef.current?.slides[currentTabIndexRef.current]

  //       const touchEvent = e as TouchEvent
  //       // console.log('[e](touchstart):', e, that)

  //       startScroll = that.scrollLeft
  //       touchStart = touchEvent.targetTouches[0].pageX
  //     },
  //     true
  //   )
  //   swiperRef.current.slides.on(
  //     'touchmove',
  //     function (e: Event) {
  //       if (!swiperRef.current) return

  //       const touchEvent = e as TouchEvent
  //       const that = swiperRef.current.slides[currentTabIndexRef.current] as Element & {
  //         offsetHeight: number
  //         offsetWidth: number
  //       }

  //       // console.log('[touchEvent](touchmove):', touchEvent, that.offsetWidth)

  //       touchCurrent = touchEvent.targetTouches[0].pageX
  //       const touchesDiff = touchCurrent - touchStart //判断滑动方向
  //       const slide = that

  //       const scrollWidth = scrollRefs[currentTabIndexRef.current].current?.scrollWidth

  //       const scrollLeft = scrollRefs[currentTabIndexRef.current].current?.scrollLeft
  //       const offsetLeft = scrollRefs[currentTabIndexRef.current].current?.offsetLeft

  //       if (!scrollWidth) return

  //       const onlyScrolling =
  //         scrollWidth > slide.offsetWidth && //如果滑动到存在滚动条的结构时，此判断为true
  //         ((touchesDiff < 0 && startScroll === 0) || //从顶部滚动到底部
  //           (touchesDiff > 0 && startScroll === scrollWidth - slide.offsetWidth) || //从底部滚动到顶部
  //           (startScroll > 0 && startScroll < scrollWidth - slide.offsetWidth)) //从中间开始

  //       console.debug(
  //         '[](startScroll,touchCurrent,touchesDiff ,onlyScrolling,slide.offsetWidth,slide.offsetWidth,slide):\n',
  //         startScroll,
  //         touchCurrent,
  //         touchesDiff,
  //         onlyScrolling,
  //         scrollWidth,
  //         slide.offsetWidth,
  //         slide.clientWidth,
  //         scrollLeft,
  //         scrollWidth,
  //         offsetLeft
  //       )

  //       // debugger
  //       // TODO 完善元素个数多时可以滚动的逻辑，目前逻辑有问题

  //       // if (onlyScrolling) {
  //       //   if (true) {
  //       if (false) {
  //         touchEvent.stopPropagation() //终止事件在传播过程的捕获、目标处理或起泡阶段进一步传播。
  //       }
  //     },
  //     true
  //   )
  //   // }, [])
  // }, [scrollRefs])

  /**
   <Tabs type="card" onTabClick={tabClick} activeKey={activeKey}>
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
          >
            <SwiperSlide>
              <TabPane tab="聚合流动性" key="1">
                <PositionCardBox>
                  {polymerizationFluidity.length ? (
                    <ScrollableRow ref={poIncreaseRef}>
                      {polymerizationFluidity.map((item: any) => (
                        <PositionCard
                          item={item}
                          type={collapseTypes.polymerizationFluidity}
                          currency={''}
                          key={item.id}
                        ></PositionCard>
                      ))}
                    </ScrollableRow>
                  ) : (
                    <EmptyShowImg></EmptyShowImg>
                  )}
                </PositionCardBox>
                <MyNavLink to={'/set'}>
                  更多 <img src={more} alt="" />
                </MyNavLink>
              </TabPane>
            </SwiperSlide>
            <SwiperSlide>
              <TabPane tab="单币挖矿" key="2">
                <PositionCardBox>
                  {singleArr.length ? (
                    <ScrollableRow >
                      {singleArr.map((item: any) => (
                        <PositionCard
                          item={item}
                          type={collapseTypes.singleCoin}
                          currency={''}
                          key={item.id}
                        ></PositionCard>
                      ))}
                    </ScrollableRow>
                  ) : (
                    <EmptyShowImg></EmptyShowImg>
                  )}
                </PositionCardBox>
                <MyNavLink to={'/single-farm'}>
                  更多 <img src={more} alt="" />
                </MyNavLink>
              </TabPane>
            </SwiperSlide>
            <SwiperSlide>
              <TabPane tab="流动性挖矿" key="3">
                <PositionCardBox>
                  {liquidityArr.length ? (
                    <ScrollableRow ref={(node) => setLiIncreaseRef(node)}>
                      {liquidityArr.map((item: any) => (
                        <PositionCard
                          item={item}
                          type={collapseTypes.liquidityMining}
                          currency={''}
                          key={item.id}
                        ></PositionCard>
                      ))}
                    </ScrollableRow>
                  ) : (
                    <EmptyShowImg></EmptyShowImg>
                  )}
                </PositionCardBox>
                <MyNavLink to={'/farm'}>
                  更多 <img src={more} alt="" />
                </MyNavLink>
              </TabPane>
            </SwiperSlide>
          </Swiper>
        </Tabs>
   */

  const [isDelay, setIsDalay] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsDalay(false)
    }, 0)
  }, [])

  // 解决切换路由进首页卡顿的问题
  if (isDelay) return null

  return (
    <TabsWrapper>
      <TabsHeader>
        {tabs.map((title, index) => {
          return (
            <TabHeaderItem
              key={index}
              className={currentTabIndex === index ? 'tab-header-active' : ''}
              onClick={() => tabsClick(index)}
            >
              {title.name}
            </TabHeaderItem>
          )
        })}
      </TabsHeader>
      <TabsContent>
        <SwiperWrapper>
          <Swiper
            autoplay={true}
            spaceBetween={50}
            slidesPerView={1}
            onSlideChange={(e: SwiperClass) => {
              // console.log('slide change', e, e.activeIndex)
              setCurrentTabIndex(e.activeIndex)
              currentTabIndexRef.current = e.activeIndex
            }}
            onSwiper={(e) => {
              console.log('[e](onSwiper):', e)
              swiperRef.current = e
            }}
          >
            <SwiperSlide>
              <PositionCardBox ref={scrollRefs[0]}>
                {polymerizationFluidity.length > 0 ? (
                  // <ScrollableRow ref={scrollRefs[0]}>
                  <ScrollableRow>
                    {polymerizationFluidity?.slice(0, positionLimit)?.map((item: any) => (
                      <PositionCard
                        item={item}
                        type={collapseTypes.polymerizationFluidity}
                        currency={''}
                        key={item.id}
                      ></PositionCard>
                    ))}
                  </ScrollableRow>
                ) : (
                  <EmptyShowImg></EmptyShowImg>
                )}
              </PositionCardBox>
            </SwiperSlide>
            <SwiperSlide>
              <PositionCardBox>
                {singleArr.length ? (
                  <ScrollableRow ref={scrollRefs[1]}>
                    {singleArr?.slice(0, positionLimit)?.map((item: any) => (
                      <PositionCard
                        item={item}
                        type={collapseTypes.singleCoin}
                        currency={''}
                        key={item.id}
                      ></PositionCard>
                    ))}
                  </ScrollableRow>
                ) : (
                  <EmptyShowImg></EmptyShowImg>
                )}
              </PositionCardBox>
            </SwiperSlide>
            <SwiperSlide>
              <PositionCardBox>
                {liquidityArr.length ? (
                  <ScrollableRow ref={scrollRefs[2]}>
                    {liquidityArr?.slice(0, positionLimit)?.map((item: any) => (
                      <PositionCard
                        item={item}
                        type={collapseTypes.liquidityMining}
                        currency={''}
                        key={item.id}
                      ></PositionCard>
                    ))}
                  </ScrollableRow>
                ) : (
                  <EmptyShowImg></EmptyShowImg>
                )}
              </PositionCardBox>
            </SwiperSlide>
          </Swiper>
        </SwiperWrapper>

        <LinkWrapper>
          <MyNavLink to={'/set'}>
            更多 <img src={more} alt="" />
          </MyNavLink>
        </LinkWrapper>
      </TabsContent>
    </TabsWrapper>
  )
}
