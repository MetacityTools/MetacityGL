import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { hello } from '../metacitygl/main'

function App() {
  const [count, setCount] = useState(0)

  hello();
  
  return (
    <div className="App">
      TODO
    </div>
  )
}

export default App
