import React from 'react'
import './App.css'
import { MetacityGL, Utils } from '../metacitygl/metacitygl';
import { MetacityLayer } from '../metacitygl/extensions';

function App() {

    return (
        <MetacityGL 
                background={0x151d29}
                target={[-742314, -1043242, 0]}>
            <MetacityLayer 
                api="https://data.metacity.cc/terrain"
                color={0x122133}
            >
                <div className='test'></div>
            </MetacityLayer>
            <MetacityLayer 
                api="https://data.metacity.cc/buildings"
                pickable
                enableUI
                styles={[
                    new Utils.Styles.Style().add(
                        new Utils.Styles.StyleAttributeRangeExt({
                            attribute: 'height',
                            min: 20,
                            max: 50
                        })
                    ).useColor([0x04d3ff, 0xFF00ea])
                ]}
            />

            <MetacityLayer 
                api="https://data.metacity.cc/bridges"
                color={0x223143}
            />
            <MetacityLayer 
                api="https://data.metacity.cc/trees"
                color={0x00728a}
            />
        </MetacityGL>
    )
}

export default App

/*
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
                    ).useColor([0x04d3ff, 0xFF00ea])
                ]}
            />

            <MetacityLayer 
                api="https://data.metacity.cc/bridges"
                color={0x223143}
            />
            <MetacityLayer 
                api="https://data.metacity.cc/trees"
            />
            */