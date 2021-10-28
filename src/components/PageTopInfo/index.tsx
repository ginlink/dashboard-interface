import React from 'react'
import Card from '../Card'
import { Content, ContentBox, ImgBox, InfoBox, PageTopInfoParame, Title, TitleInfo } from './style'
export default function PageTopInfo({
  cardTitle,
  cardValue,
  imgWidth,
  imgHeight,
  title = '',
  content = '',
  imgUrl,
  isShowTitleInfo = false,
}: PageTopInfoParame) {
  return (
    <ContentBox>
      <InfoBox imgHeight={imgHeight} isShowTitleInfo={isShowTitleInfo}>
        {isShowTitleInfo && (
          <TitleInfo>
            <Title>{title}</Title>
            <Content>{content}</Content>
          </TitleInfo>
        )}
        <Card cardTitle={cardTitle} cardValue={cardValue}></Card>
      </InfoBox>
      <ImgBox imgWidth={imgWidth} imgHeight={imgHeight}>
        <img src={imgUrl} alt="" />
      </ImgBox>
    </ContentBox>
  )
}
