import React, { useCallback } from 'react'
import {
  HomeWarpper,
  ContentBox,
  TitleAndImgBox,
  InfoBox,
  ImgBox,
  TitleBox,
  Title,
  Line,
  Tip,
  BtnBox,
  ItemBox,
  InfoTitle,
  PriceValue,
  MiningPoolBox,
  MiningPoolTitleBox,
  Header,
  HeaderContent,
  PartnerBox,
  PartnerTitle,
  PartnerImgs,
  AuditBox,
  AuditTip,
} from './style'
import img1 from '../../assets/images/home/img1.svg'
import img2 from '../../assets/images/home/img2.svg'
import partner1 from '../../assets/images/home/partner/partner1.svg'
import partner3 from '../../assets/images/home/partner/partner3.svg'
import partner5 from '../../assets/images/home/partner/partner5.svg'
import partner2 from '../../assets/images/home/partner/partner2.png'
import partner4 from '../../assets/images/home/partner/partner4.png'
import partner6 from '../../assets/images/home/partner/partner6.png'
import partner7 from '../../assets/images/home/partner/partner7.png'
import audit from '../../assets/images/home/partner/audit.png'
import { useTheme } from 'styled-components'
import ButtonComponent from '@/components/ButtonComponents'
import PartnerImgComponent from '@/components/PartnerImgComponent'
import HomePositionCard from '@/components/HomePositionCard'
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'
export default function Home() {
  const theme = useTheme()
  const introductionFn = useCallback(() => {
    console.log('点击简介')
  }, [])
  const commonProblemFn = useCallback(() => {
    console.log('点击常见问题')
  }, [])
  const changeFn = useCallback((key: string) => {
    console.log('切换', key)
  }, [])
  const isPc = useIsPcByScreenWidth()
  return (
    <>
      <Header>
        <HeaderContent>
          <TitleAndImgBox>
            <TitleBox>
              <Line color={theme.bg9}></Line>
              <Title>CONVERTER</Title>
              <Tip>首个参与聚合流动性的聚合收益器，为您的收益带来更多增长</Tip>
              <BtnBox>
                <ButtonComponent btnName={'简介'} clickBtn={introductionFn}></ButtonComponent>
                <ButtonComponent
                  btnName={'常见问题'}
                  backgroundColor={theme.black}
                  clickBtn={commonProblemFn}
                ></ButtonComponent>
              </BtnBox>
            </TitleBox>
            <ImgBox>
              <img src={img1} alt="" />
            </ImgBox>
          </TitleAndImgBox>
          <InfoBox>
            <ItemBox>
              <InfoTitle>锁仓量</InfoTitle>
              <PriceValue>$562.23B</PriceValue>
            </ItemBox>
            <ItemBox>
              <InfoTitle>CON价格</InfoTitle>
              <PriceValue>$2.26</PriceValue>
            </ItemBox>
            <ItemBox>
              <InfoTitle>CON流通量</InfoTitle>
              <PriceValue>356.45K</PriceValue>
            </ItemBox>
          </InfoBox>
        </HeaderContent>
      </Header>
      <HomeWarpper>
        <ContentBox>
          <MiningPoolBox>
            <img src={img2} alt="" />
            <MiningPoolTitleBox>
              <Line color={theme.bg10}></Line>
              <Title>更有竞争力的矿池</Title>
              <Tip>我们为您提供收益更高的矿池，让您轻松享受DEFI的乐趣</Tip>
            </MiningPoolTitleBox>
          </MiningPoolBox>
          <HomePositionCard changeFn={changeFn}></HomePositionCard>
          <AuditBox>
            <Line color={theme.bg11}></Line>
            <Title>我们共同构建更全面的生态</Title>
            <AuditTip>Audit Agency</AuditTip>
            <img src={audit} alt="" />
          </AuditBox>
        </ContentBox>
      </HomeWarpper>
      <PartnerBox>
        <PartnerTitle>Partner</PartnerTitle>
        <PartnerImgs>
          <div>
            <PartnerImgComponent imgUrl={partner1}></PartnerImgComponent>
            {isPc ? (
              <PartnerImgComponent imgUrl={partner6}></PartnerImgComponent>
            ) : (
              <PartnerImgComponent imgUrl={partner5}></PartnerImgComponent>
            )}
          </div>
          <div>
            <PartnerImgComponent imgUrl={partner2}></PartnerImgComponent>
            {!isPc ? (
              <PartnerImgComponent imgUrl={partner6}></PartnerImgComponent>
            ) : (
              <PartnerImgComponent imgUrl={partner7}></PartnerImgComponent>
            )}
          </div>
          <div>
            <PartnerImgComponent imgUrl={partner3}></PartnerImgComponent>
            {!isPc && <PartnerImgComponent imgUrl={partner7}></PartnerImgComponent>}
          </div>
          <div>
            <PartnerImgComponent imgUrl={partner4}></PartnerImgComponent>
          </div>
          {isPc && (
            <div>
              <PartnerImgComponent imgUrl={partner5}></PartnerImgComponent>
            </div>
          )}
        </PartnerImgs>
      </PartnerBox>
    </>
  )
}
