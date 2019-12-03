# @slynch13/usedebounce

> Hook that implements debounce functionality

[![NPM](https://img.shields.io/npm/v/@slynch13/usedebounce.svg)](https://www.npmjs.com/package/@slynch13/usedebounce) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @slynch13/usedebounce
```

## Usage

```jsx
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@slynch13/usedebounce'
import { useInterval } from '@slynch13/useinterval'

const App = () => {
  let [state, setState] = useState(0)
  let [count, setCount] = useState(0)
  let [speed, setSpeed] = useState(1000)
  let delay = 1000
  const debounced = useDebounce((display) => {
    setState(x => x + 1)
  }, delay)
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
      <div>Speed: {speed}ms</div>
      <div>State: {state}</div>
      <div>Executed: {count}</div>
    </div>
  )
}
export default App
```

## License

MIT © [Sean Lynch](https://github.com/slynch13)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
