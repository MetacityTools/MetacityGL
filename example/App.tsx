import React from 'react'
import './App.css'
import { Grid, MetacityGL } from '../metacitygl/metacitygl';
import { ExampleLayer } from './layer';

function App() {

    return (
        <MetacityGL background={0x222222}>
            <ExampleLayer
            />
            <Grid
                from={[-100, -100]}
                to={[100, 100]}
                major={20}
                divideMajor={2}
                z={0}
                color={0x000000}
                thickness={1}
            />
        </MetacityGL>
    )
}

export default App
