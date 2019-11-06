import { useRef, useState, useEffect } from 'react'

export const useDebounce = (func, delay, maxWait, executionOptions = executeAt.start) => {
  let [wait, setWait] = useState(maxWait)
  let [args, setArgs] = useState()
  let [runtimeFunc, setFunc] = useState(() => func)
  let [lastExecute, setLastExecute] = useState()
  let debug = useRef(false)

  let log = (...message) => {
    if (debug.current) {
      console.log(...message)
    }
  }
  useEffect(() => {
    if (args === undefined) return
    let diff = Date.now() - lastExecute
    log('Use Effect Executing', args, delay, lastExecute, diff, executionOptions)
    if (lastExecute === undefined || diff >= maxWait) {
      if (executionOptions.start === true) {
        log('It should be running!!', runtimeFunc)
        runtimeFunc(...args)
      }
      setLastExecute(Date.now())
    }

    let timeout = setTimeout(() => {
      log('Executing Timeout', runtimeFunc, { args: args }, executionOptions)
      if (executionOptions.end) runtimeFunc(...args)
      setArgs(undefined)
      setLastExecute(undefined)
    }, delay)
    return () => {
      clearTimeout(timeout)
    }
  }, [args, wait, lastExecute])

  let debounced = (...args) => {
    log('Updating Args', args)
    setArgs(args || [])
  }

  debounced.force = (...args) => {
    runtimeFunc(...args)
    setLastExecute(Date.now())
  }
  debounced.setWait = setWait
  debounced.enableDebugging = () => {
    debug.current = true
  }
  debounced.disableDebugging = () => {
    debug.current = false
  }
  return debounced
}

export const executeAt = {
  start: { start: true, end: false },
  end: { start: false, end: true },
  both: { start: true, end: true }
}
