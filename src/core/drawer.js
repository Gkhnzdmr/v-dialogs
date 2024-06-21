import { onMounted, watch } from 'vue'

import {
  DRAWER_WIDTH,
  DRAWER_HEIGHT,
  PLACEMENT_TOP,
  PLACEMENT_BOTTOM,
  FULL_WIDTH,
  FULL_HEIGHT
} from '../constants'
import { createDialog } from './manage'
import { useDialog } from './base'

import TheDialogDrawer from '../modules/drawer/DialogDrawer'

export function useDrawer (props, emit) {
  const {
    show,
    setPosition,
    setDialogSize,
    openDialog,
    closeDialogWithCallback,
    closeDialogWithoutCallback,
    setupAutomaticClose,
    setupPositionAdjustBehavior,
    ...restItems
  } = useDialog(props, emit)

  const { width, height } = getDrawerSize(props)

  watch(() => props.visible, val => {
    if (val) return
    closeDrawerWithoutCallback()
  })

  function setModalTop () {
    setPosition()
  }
  const closeOptions = {
    closing: () => {
      emit('update:visible', false)
    }
  }
  function closeDrawerWithCallback (data) {
    closeDialogWithCallback(data, closeOptions)
  }
  function closeDrawerWithoutCallback () {
    closeDialogWithoutCallback(closeOptions)
  }

  setDialogSize(width, height)
  // setupPositionAdjustBehavior(setModalTop)
  setupAutomaticClose(closeDrawerWithCallback)

  onMounted(() => {
    openDialog()
  })

  return {
    ...restItems,
    show,
    setModalTop,
    closeDrawerWithCallback,
    closeDrawerWithoutCallback,
    backdropCloseDialog: closeDrawerWithoutCallback
  }
}

function getDrawerSize (props) {
  const { width, height, placement } = props

  const widthValue = width || DRAWER_WIDTH
  const heightValue = height || DRAWER_HEIGHT

  if (placement === PLACEMENT_TOP || placement === PLACEMENT_BOTTOM) {
    return { width: FULL_WIDTH, height: heightValue }
  }
  // placement left, right and others
  return { width: widthValue, height: FULL_HEIGHT }
}

/**
 * Open a drawer dialog
 *
 * @param {string} message - message content
 * @param {function} [callback] - callback function
 * @param {object} [option] - options
 * @returns
 */
export function DialogDrawer (component, options = {}) {
  const props = { ...options, component }
  return createDialog(TheDialogDrawer, props)
}
