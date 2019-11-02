import { useCallback, useRef, useState } from 'react'

export const useDebounce = (func, delay, maxWait, executionOptions = executeAt.start) => {
  let timer = useRef()
  let [wait, setWait] = useState(maxWait)
  let lastExecute = useRef()
  let lastArgs = useRef()
  let resetTimer = () => {
    let oldTimeout = timer.current
    clearTimeout(oldTimeout)
    timer.current = setTimeout(() => {
      timer.current = undefined
    }, delay)
  }

  let execute = (args) => {
    lastExecute.current = Date.now()
    lastArgs.current = undefined
    func(...args)
  }

  let debounced = (...args) => {
    let diff = Date.now() - lastExecute.current
    if ((wait === undefined || diff < wait) &&
      timer.current !== undefined) {
      resetTimer()
      lastArgs.current = args

      return
    }
    timer.current = setTimeout(() => {
      timer.current = undefined
    }, delay)
    execute(args || [])
  }

  let callback = useCallback(debounced)
  callback.force = (args) => {
    resetTimer()
    execute(args)
  }
  callback.setWait = setWait

  return callback
}

export const executeAt = {
  start: { start: true, end: false },
  end: { start: false, end: true },
  both: { start: true, end: true }
}
