import React, { useState, useEffect } from 'react'
import { useDebounce } from '@slynch13/usedebounce'
import { useInterval } from '@slynch13/useinterval'

const App = () => {
  let [state, setState] = useState(0)
  let [last, setLast] = useState('')
  let [count, setCount] = useState(0)
  const debounced = useDebounce((display) => {
    setState(x => x + 1)
    setLast(display)
    console.log('Executing')
  }, 3000)
  let interval = useInterval(() => {
    console.log('Test')
    setCount(x => x + 1)
    debounced()
  }, 1000)

  useEffect(() => {
    if (count > 10) {
      interval.changeTimeout(2000)
    }
    if (count > 20) {
      interval.changeTimeout(3000)
    }
    if (count > 30) {
      interval.changeTimeout(4000)
    }
  }, [count])
  return (
    <div>
      {state}
      <div>{last}</div>
      <div>Executed: {count}</div>
    </div>
  )
}
export default App
