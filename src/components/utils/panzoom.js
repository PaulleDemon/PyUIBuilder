//NOTE: This is only for testing purpose, not really meant to be used
import './polyfills'

import {
  addPointer,
  getDistance,
  getMiddle,
  removePointer
} from './pointers'
import { destroyPointer, eventNames, onPointer } from './events'
import { getDimensions, setStyle, setTransform, setTransition } from './css'

import isAttached from './isAttached'
import isExcluded from './isExcluded'
import isSVGElement from './isSVGElement'
import shallowClone from './shallowClone'

const defaultOptions = {
  animate: false,
  canvas: false,
  cursor: 'move',
  disablePan: false,
  disableZoom: false,
  disableXAxis: false,
  disableYAxis: false,
  duration: 200,
  easing: 'ease-in-out',
  exclude: [],
  excludeClass: 'panzoom-exclude',
  handleStartEvent: (e) => {
    e.preventDefault()
    e.stopPropagation()
  },
  maxScale: 4,
  minScale: 0.125,
  overflow: 'hidden',
  panOnlyWhenZoomed: false,
  pinchAndPan: false,
  relative: false,
  setTransform,
  startX: 0,
  startY: 0,
  startScale: 1,
  step: 0.3,
  touchAction: 'none'
}

function Panzoom(elem, options = {}) {
  if (!elem) {
    throw new Error('Panzoom requires an element as an argument')
  }
  if (elem.nodeType !== 1) {
    throw new Error('Panzoom requires an element with a nodeType of 1')
  }
  if (!isAttached(elem)) {
    throw new Error('Panzoom should be called on elements that have been attached to the DOM')
  }

  options = {
    ...defaultOptions,
    ...options
  }

  const isSVG = isSVGElement(elem)
  const parent = elem.parentNode

  // Set parent styles
  parent.style.overflow = options.overflow // hidden
  parent.style.userSelect = 'none'
  parent.style.touchAction = options.touchAction
  (options.canvas ? parent : elem).style.cursor = options.cursor

  // Set element styles
  elem.style.userSelect = 'none'
  elem.style.touchAction = options.touchAction
  setStyle(
    elem,
    'transformOrigin',
    typeof options.origin === 'string' ? options.origin : isSVG ? '0 0' : '50% 50%'
  )

  function resetStyle() {
    parent.style.overflow = ''
    parent.style.userSelect = ''
    parent.style.touchAction = ''
    parent.style.cursor = ''
    elem.style.cursor = ''
    elem.style.userSelect = ''
    elem.style.touchAction = ''
    setStyle(elem, 'transformOrigin', '')
  }

  function setOptions(opts = {}) {
    for (const key in opts) {
      if (opts.hasOwnProperty(key)) {
        options[key] = opts[key]
      }
    }
    // Handle option side-effects
    if (opts.hasOwnProperty('cursor') || opts.hasOwnProperty('canvas')) {
      parent.style.cursor = elem.style.cursor = ''
      (options.canvas ? parent : elem).style.cursor = options.cursor
    }
    if (opts.hasOwnProperty('overflow')) {
      parent.style.overflow = opts.overflow
    }
    if (opts.hasOwnProperty('touchAction')) {
      parent.style.touchAction = opts.touchAction
      elem.style.touchAction = opts.touchAction
    }
  }

  let x = 0
  let y = 0
  let scale = 1
  let isPanning = false
  zoom(options.startScale, { animate: false, force: true })
  // Wait for scale to update
  // for accurate dimensions
  // to constrain initial values
  setTimeout(() => {
    pan(options.startX, options.startY, { animate: false, force: true })
  })

  function trigger(eventName, detail, opts) {
    if (opts.silent) {
      return
    }
    const event = new CustomEvent(eventName, { detail })
    elem.dispatchEvent(event)
  }

  function setTransformWithEvent(
    eventName,
    opts,
    originalEvent
  ) {
    const value = { x, y, scale, isSVG, originalEvent }
    requestAnimationFrame(() => {
      if (typeof opts.animate === 'boolean') {
        if (opts.animate) {
          setTransition(elem, opts)
        } else {
          setStyle(elem, 'transition', 'none')
        }
      }
      opts.setTransform(elem, value, opts)
      trigger(eventName, value, opts)
      trigger('panzoomchange', value, opts)
    })
    return value
  }

  function constrainXY(
    toX,
    toY,
    toScale,
    panOptions
  ) {
    const opts = { ...options, ...panOptions }
    const result = { x, y, opts }
    if (!opts.force && (opts.disablePan || (opts.panOnlyWhenZoomed && scale === opts.startScale))) {
      return result
    }
    toX = parseFloat(toX)
    toY = parseFloat(toY)

    if (!opts.disableXAxis) {
      result.x = (opts.relative ? x : 0) + toX
    }

    if (!opts.disableYAxis) {
      result.y = (opts.relative ? y : 0) + toY
    }

    if (opts.contain) {
      const dims = getDimensions(elem)
      const realWidth = dims.elem.width / scale
      const realHeight = dims.elem.height / scale
      const scaledWidth = realWidth * toScale
      const scaledHeight = realHeight * toScale
      const diffHorizontal = (scaledWidth - realWidth) / 2
      const diffVertical = (scaledHeight - realHeight) / 2

      if (opts.contain === 'inside') {
        const minX = (-dims.elem.margin.left - dims.parent.padding.left + diffHorizontal) / toScale
        const maxX =
          (dims.parent.width -
            scaledWidth -
            dims.parent.padding.left -
            dims.elem.margin.left -
            dims.parent.border.left -
            dims.parent.border.right +
            diffHorizontal) /
          toScale
        result.x = Math.max(Math.min(result.x, maxX), minX)
        const minY = (-dims.elem.margin.top - dims.parent.padding.top + diffVertical) / toScale
        const maxY =
          (dims.parent.height -
            scaledHeight -
            dims.parent.padding.top -
            dims.elem.margin.top -
            dims.parent.border.top -
            dims.parent.border.bottom +
            diffVertical) /
          toScale
        result.y = Math.max(Math.min(result.y, maxY), minY)
      } else if (opts.contain === 'outside') {
        const minX =
          (-(scaledWidth - dims.parent.width) -
            dims.parent.padding.left -
            dims.parent.border.left -
            dims.parent.border.right +
            diffHorizontal) /
          toScale
        const maxX = (diffHorizontal - dims.parent.padding.left) / toScale
        result.x = Math.max(Math.min(result.x, maxX), minX)
        const minY =
          (-(scaledHeight - dims.parent.height) -
            dims.parent.padding.top -
            dims.parent.border.top -
            dims.parent.border.bottom +
            diffVertical) /
          toScale
        const maxY = (diffVertical - dims.parent.padding.top) / toScale
        result.y = Math.max(Math.min(result.y, maxY), minY)
      }
    }

    if (opts.roundPixels) {
      result.x = Math.round(result.x)
      result.y = Math.round(result.y)
    }

    return result
  }

  function constrainScale(toScale, zoomOptions) {
    const opts = { ...options, ...zoomOptions }
    const result = { scale, opts }
    if (!opts.force && opts.disableZoom) {
      return result
    }

    let minScale = options.minScale
    let maxScale = options.maxScale

    if (opts.contain) {
      const dims = getDimensions(elem)
      const elemWidth = dims.elem.width / scale
      const elemHeight = dims.elem.height / scale
      if (elemWidth > 1 && elemHeight > 1) {
        const parentWidth = dims.parent.width - dims.parent.border.left - dims.parent.border.right
        const parentHeight = dims.parent.height - dims.parent.border.top - dims.parent.border.bottom
        const elemScaledWidth = parentWidth / elemWidth
        const elemScaledHeight = parentHeight / elemHeight
        if (options.contain === 'inside') {
          maxScale = Math.min(maxScale, elemScaledWidth, elemScaledHeight)
        } else if (options.contain === 'outside') {
          minScale = Math.max(minScale, elemScaledWidth, elemScaledHeight)
        }
      }
    }

    result.scale = Math.min(Math.max(toScale, minScale), maxScale)
    return result
  }

  function pan(
    toX,
    toY,
    panOptions,
    originalEvent
  ) {
    const result = constrainXY(toX, toY, scale, panOptions)

    // Only try to set if the result is somehow different
    if (x !== result.x || y !== result.y) {
      x = result.x
      y = result.y
      return setTransformWithEvent('panzoompan', result.opts, originalEvent)
    }
    return { x, y, scale, isSVG, originalEvent }
  }

  function zoom(
    toScale,
    zoomOptions,
    focal
  ) {
    const result = constrainScale(toScale, zoomOptions)
    const zoomScale = result.scale
    const zoomOpts = result.opts
    if (scale !== zoomScale) {
      scale = zoomScale
      let toX = x
      let toY = y
      if (focal) {
        const focalX = focal.x || 0
        const focalY = focal.y || 0
        const diffScale = zoomScale / scale
        toX = focalX - (focalX - x) * diffScale
        toY = focalY - (focalY - y) * diffScale
      }
      return pan(toX, toY, zoomOpts, zoomOptions.originalEvent)
    }
    return { x, y, scale, isSVG: isSVGElement(elem), originalEvent: zoomOptions.originalEvent }
  }

  function zoomIn(zoomOptions) {
    zoom(scale + options.step, zoomOptions)
  }

  function zoomOut(zoomOptions) {
    zoom(scale - options.step, zoomOptions)
  }

  function zoomToPoint(toScale, point, zoomOptions) {
    zoom(toScale, zoomOptions, point)
  }

  function zoomWithWheel(event) {
    const delta = Math.sign(event.deltaY) * -0.1
    const zoomFactor = Math.pow(1.2, delta)
    zoom(scale * zoomFactor, {}, {
      x: event.clientX,
      y: event.clientY
    })
  }

  function handleDown(event) {
    if (isExcluded(event.target, options.exclude, options.excludeClass)) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    isPanning = true
    const point = { x: event.clientX, y: event.clientY }
    addPointer(event)
    elem.style.cursor = options.cursor
    trigger('panzoomstart', { x, y, scale, originalEvent: event })

    function handleMove(e) {
      if (!isPanning) {
        return
      }
      e.preventDefault()
      e.stopPropagation()
      if (options.pinchAndPan && e.pointerType === 'touch') {
        if (e.pointerId === e.pointers[0].pointerId) {
          e.target.style.cursor = options.cursor
          return
        }
        e.target.style.cursor = ''
        const dist = getDistance(e)
        const middle = getMiddle(e)
        zoom(scale * (dist / e.pointers[0].distance), {
          animate: false,
          originalEvent: e
        }, middle)
      } else {
        pan(
          x + (e.clientX - point.x) / scale,
          y + (e.clientY - point.y) / scale,
          { animate: false, force: true },
          e
        )
      }
    }

    function handleUp(e) {
      isPanning = false
      removePointer(e)
      if (e.pointerType !== 'touch' || e.pointerId !== e.pointers[0].pointerId) {
        return
      }
      elem.style.cursor = ''
      trigger('panzoomend', { x, y, scale, originalEvent: e })
    }

    onPointer(handleMove, handleUp, event)
  }

  function reset() {
    setOptions({
      ...defaultOptions,
      ...options
    })
    zoom(options.startScale, { animate: false, force: true })
    pan(options.startX, options.startY, { animate: false, force: true })
  }

  reset()

  return {
    zoom,
    zoomIn,
    zoomOut,
    zoomToPoint,
    zoomWithWheel,
    pan,
    reset,
    setOptions,
    destroy() {
      setStyle(elem, 'transition', '')
      resetStyle()
      destroyPointer()
      eventNames.forEach((eventName) => {
        elem.removeEventListener(eventName, handleDown)
      })
    }
  }
}

export default Panzoom
