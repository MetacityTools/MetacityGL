import React from 'react'
import './App.css'
import { MetacityGL, Utils } from '../metacitygl/metacitygl';
import { MetacityTreeLayer, MetacityLayer } from '../metacitygl/extensions';

function App() {

    return (
        <MetacityGL 
                background={0x151d29}
                target={[-742441, -1043242, 0]}>
            <MetacityTreeLayer 
                api="https://data.metacity.cc/buildingstest"
                pickable
                enableUI
                colorPlaceholder={0x202c3d}
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
        </MetacityGL>
    )
}

export default App

/*

            <MetacityLayer 
                api="https://data.metacity.cc/bridges"
                color={0x234063}
                placeholderColor={0x202c3d}
            />
            <MetacityLayer 
                api="https://data.metacity.cc/trees"
                pointInstanceModel="/tree.glb"
                size={20}
                swapDistance={4000}
                color={0x00728a}
                placeholderColor={0x202c3d}
            />

                        <MetacityLayer 
                api="https://data.metacity.cc/terrain"
                color={0x1b3452}
                placeholderColor={0x202c3d}
            />*/