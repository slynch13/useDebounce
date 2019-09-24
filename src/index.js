import { useCallback, useRef } from 'react'

export const useDebounce = (func, delay) => {
  let timer = useRef()

  let resetTimer = () => {
    let oldTimeout = timer.current
    clearTimeout(oldTimeout)
    timer.current = setTimeout(() => {
      timer.current = undefined
    }, delay)
  }

  let debounced = (...args) => {
    if (timer.current) {
      resetTimer()
      return
    }
    timer.current = setTimeout(() => {
      timer.current = undefined
    }, delay)
    func(args || [])
  }

  let callback = useCallback(debounced)
  callback.force = (...args) => {
    resetTimer()
    func(args || [])
  }

  return callback
}
