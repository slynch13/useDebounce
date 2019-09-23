import { useCallback, useRef } from 'react'

export const useDebounce = (func, delay) => {
  let timer = useRef()
  let debounced = (...args) => {
    if (timer.current) {
      let oldTimeout = timer.current
      clearTimeout(oldTimeout)
      timer.current = setTimeout(() => {
        timer.current = undefined
      }, delay)
      return
    }
    timer.current = setTimeout(() => {
      timer.current = undefined
    }, delay)
    func(args || [])
  }

  return useCallback(debounced)
}
