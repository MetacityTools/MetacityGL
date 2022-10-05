import React from 'react'
import './App.css'
import { Grid, MetacityGL, Utils } from '../metacitygl/metacitygl';
import { MetacityLayer } from './layers/layer';

function App() {

    return (
        <MetacityGL 
                background={0x151d29}
                target={[-742977, -1051266, 0]}>
            <MetacityLayer 
                api="https://data.metacity.cc/terrain"
                color={0x122133}
                //color={0x13356e}
            />
            <MetacityLayer 
                api="https://data.metacity.cc/buildings"
                pickable
                styles={[
                    new Utils.Styles.Style().add(
                        new Utils.Styles.StyleAttributeRangeExt({
                            attribute: 'height',
                            min: 20,
                            max: 50
                        })
                    //).useColor([0x0088FF, 0xFF0088])
                    ).useColor([0x04d3ff, 0xFF00ea])
                ]}
            />

            <MetacityLayer 
                api="https://data.metacity.cc/bridges"
                color={0x223143}
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

/*
<MetacityLayer 
api="https://data.metacity.cc/buildings"
/>

<MetacityLayer 
api="https://data.metacity.cc/bridges"
color={0x223143}
/>*/