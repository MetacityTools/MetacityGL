import React from 'react'
import './App.css'
import { Grid, MetacityGL } from '../metacitygl/metacitygl';
import { MetacityLayer } from './layers/layer';

function App() {

    return (
        <MetacityGL background={0x222222}
                    target={[-742977, -1051266, 0]}>
            <MetacityLayer 
                api="https://data.metacity.cc/buildings"
            />
            <MetacityLayer 
                api="https://data.metacity.cc/terrain"
            />
            <MetacityLayer 
                api="https://data.metacity.cc/bridges"
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
