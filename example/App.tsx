import React from 'react'
import './App.css'
import { MetacityGL } from '../metacitygl/metacitygl';
import { ExampleLayer } from './layer';

function App() {

    return (
        <MetacityGL>
            <ExampleLayer
                enableUI
            />
        </MetacityGL>
    )
}

export default App
