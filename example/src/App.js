import React from 'react'
import { useMyHook } from '@slynch13/usedebounce'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App