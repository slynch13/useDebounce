import { useCallback, useRef, useState } from 'react'

export const useDebounce = (func, delay, maxWait) => {
  let timer = useRef()
  let [wait, setWait] = useState(maxWait)
  let lastExecute = useRef()

  let resetTimer = () => {
    let oldTimeout = timer.current
    clearTimeout(oldTimeout)
    timer.current = setTimeout(() => {
      timer.current = undefined
    }, delay)
  }
  let execute = (...args) => {
    lastExecute.current = Date.now()
    func(args)
  }
  let debounced = (...args) => {
    let diff = Date.now() - lastExecute.current
    if ((wait === undefined || diff < wait) &&
      timer.current !== undefined) {
      resetTimer()
      return
    }
    timer.current = setTimeout(() => {
      timer.current = undefined
    }, delay)
    execute(args || [])
  }

  let callback = useCallback(debounced)
  callback.force = (...args) => {
    resetTimer()
    execute(args)
  }
  callback.setWait = setWait

  return callback
}
