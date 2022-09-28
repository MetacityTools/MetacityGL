import React from 'react'
import './App.css'
import { VisualizationCanvas } from '../metacitygl/view'
import { MetacityGL } from '../metacitygl/metacitygl'

function App() {
  const [engine] = React.useState(new MetacityGL());

  return (
    <div id="app">
      <VisualizationCanvas engine={engine}/>
    </div>
  )
}

export default App
