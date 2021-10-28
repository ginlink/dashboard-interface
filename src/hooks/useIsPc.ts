import { useScreenWidth } from '@/store/application/hooks'

export function useIsPcByScreenWidth() {
  const currentScreenWidth = useScreenWidth()

  return currentScreenWidth ? currentScreenWidth > parseInt('960px') : true
  // 默认情况下是PC端
}
