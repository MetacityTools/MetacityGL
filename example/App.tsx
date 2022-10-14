import React from 'react'
import './App.css'
import { MetacityGL, Utils } from '../metacitygl/metacitygl';
import { MetacityTreeLayer } from '../metacitygl/extensions';

function App() {

    return (
        <MetacityGL 
                background={0x151d29}
                target={[-742921, -1043242, 0]}>
            <MetacityTreeLayer 
                api="https://data.metacity.cc/pragueTreesTree"
                instance="/tree.glb"
                size={20}
                swapDistance={4000}
                color={0x00728a}
                tree={{
                    visualizeTree: false
                }}
            />
            <MetacityTreeLayer 
                api="https://data.metacity.cc/pragueTerrainTree"
                color={0x1b3452}
                tree={{
                    //zOffset: -1
                }}
            />
            <MetacityTreeLayer 
                api="https://data.metacity.cc/pragueBridgesTree"
                color={0x234063}
                tree={{
                    //zOffset: -1
                    visualizeTree: false
                }}
            />
            <MetacityTreeLayer 
                api="https://data.metacity.cc/pragueBuildingTree"
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
                tree={{
                    zOffset: 5
                }}
            />
        </MetacityGL>
    )
}

export default App

/*

            <MetacityTreeLayer 
                api="https://data.metacity.cc/pragueBuildingTree"
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
                tree={{}}
            />
            <MetacityTreeLayer 
                api="https://data.metacity.cc/pragueTerrainTree"
                color={0x1b3452}
                tree={{
                    zOffset: 10
                }}
            />
            
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