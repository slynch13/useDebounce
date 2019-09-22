import { useCallback, useState, useRef } from 'react'

export const useDebounce = (func, delay) => {
  let timer = useRef()
  let debounced = (...args) => {
    if (timer.current) {
      console.log('Bounced', delay)
      let oldTimeout = timer.current
      clearTimeout(oldTimeout)
      timer.current = setTimeout(() => {
        console.log('Test')
        timer.current = undefined
      }, delay)
      return
    }
    timer.current = setTimeout(() => {
      console.log('Test2')
      timer.current = undefined
    }, delay)
    func(args || [])
  }

  return useCallback(debounced)
}
