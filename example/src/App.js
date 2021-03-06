import React, { useState, useEffect } from 'react'
import { useDebounce } from '@slynch13/usedebounce'
import { useInterval } from '@slynch13/useinterval'

const App = () => {
  let [state, setState] = useState(0)
  let [count, setCount] = useState(0)
  let [speed, setSpeed] = useState(1000)
  let delay = 1000
  let maxWait = 10000
  const debounced = useDebounce((display) => {
    setState(x => x + 1)
  }, delay, maxWait)
  let interval = useInterval(() => {
    setCount(x => x + 1)
    debounced()
  }, 500)

  useEffect(() => {
    if (count % 100 < 10) {
      setSpeed(500)
    } else if (count % 100 < 20) {
      setSpeed(1000)
    } else if (count % 100 < 30) {
      setSpeed(2000)
    } else {
      setSpeed(100)
    }
  }, [count])
  useEffect(() => {
    interval.changeTimeout(speed)
  }, [speed])
  return (
    <div>
      <div>Delay: {delay}ms</div>
      <div>Max Wait: {maxWait}ms</div>
      <div>Speed: {speed}ms</div>
      <div>State: {state}</div>
      <div>Executed: {count}</div>
      <div><button onClick={() => { debounced.force() }}>Force</button></div>
    </div>
  )
}
export default App
