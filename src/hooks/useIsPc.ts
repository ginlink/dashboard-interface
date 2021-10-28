import { useScreenWidth } from '@/store/application/hooks'
import { MEDIUM } from 'utils/adapteH5'

export function useIsPcByScreenWidth() {
  const currentScreenWidth = useScreenWidth()

  return currentScreenWidth ? currentScreenWidth > parseInt(MEDIUM) : true
  // 默认情况下是PC端
}
