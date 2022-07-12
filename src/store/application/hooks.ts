import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../state'
import { setScreenWidthAction, setOpenmodalAction, PopupContent, addPopupAction, removePopupAction } from './action'
import { ApplicationModal } from './reducer'

export function useSetScreenWidth() {
  const dispatch = useDispatch()

  return useCallback(
    (width: number | undefined) => {
      dispatch(setScreenWidthAction(width))
    },
    [dispatch]
  )
}

export function useScreenWidth() {
  const application = useSelector((state: RootState) => state.application)

  return application.screenWidth
}

// 检查传入modal是否正在开启
export function useModalOpen(modal: ApplicationModal) {
  const state = useSelector((state: RootState) => state.application)

  return state.openModal === modal
}

export function useToggleModal(modal: ApplicationModal) {
  const open = useModalOpen(modal)

  const dispatch = useDispatch()

  return useCallback(() => {
    dispatch(setOpenmodalAction(open ? undefined : modal))
  }, [dispatch, modal, open])
}

// popup
export function useAddPopup() {
  const dispatch = useDispatch()

  return useCallback(
    (content: PopupContent, ms?: number) => {
      dispatch(addPopupAction(content, ms))
    },
    [dispatch]
  )
}
export function useRemovePopup() {
  const dispatch = useDispatch()

  return useCallback(
    (key: string) => {
      dispatch(removePopupAction(key))
    },
    [dispatch]
  )
}

export function useActivePopupList() {
  const container = useSelector((state: RootState) => state.application.popupContainer)

  useEffect(() => {
    console.debug('[](container):', container)
  }, [container])

  return useMemo(() => {
    const keys = Object.keys(container)
    if (keys.length <= 0) return []

    return keys.map((key) => {
      const { content, removeAfterMs } = container[key]

      return { key, content, removeAfterMs }
    })
  }, [container])
}
