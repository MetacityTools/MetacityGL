import React from 'react'
import './App.css'
import { MetacityGL, Utils, Extensions } from '../metacitygl/metacitygl';

function App() {
    return (
        <MetacityGL
        //background={0x151d29}
        background={0x151515}
        target={[-742921, -1043242, 0]}
        antialias>
        <Extensions.MetacityTreeLayer
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
                zOffset: 5,
                visualizeTree: false
            }}
        >
        <div id="legend">
            <h2>Prague: Building Heights</h2>
            <div id="map">
                <div id="colormap"></div>
                <div id="labels">
                    <div>20 m and below</div>
                    <div>50 m and up</div>
                </div>
            </div>
        </div>
        </Extensions.MetacityTreeLayer>
    </MetacityGL>
    )
}

export default App


/*
            <Extensions.MetacityTreeLayer
                api="https://data.metacity.cc/pragueLampsDetailTree"
                instance="/lamp.glb"
                size={1}
                pickable
                swapDistance={4000}
                color={[1.8, 1.5, 1.5]}
                tree={{
                    zOffset: 5,
                    visualizeTree: false
                }}
            />
            <Extensions.MetacityTreeLayer
                api="https://data.metacity.cc/pragueBuildingTree"
                pickable
                color={0x444444}
                tree={{
                    zOffset: 5,
                }}
            />
             <Extensions.MetacityTreeLayer
                api="https://data.metacity.cc/pragueTreesTree"
                instance="/tree.glb"
                size={1}
                swapDistance={4000}
                color={0x333333}
                tree={{
                    visualizeTree: false
                }}
            />
            <Extensions.MetacityTreeLayer
                api="https://data.metacity.cc/pragueTerrainTree"
                color={0x222222}
                tree={{
                    //zOffset: -1
                }}
            />
            <Extensions.MetacityTreeLayer
                api="https://data.metacity.cc/pragueBridgesTree"
                color={0x333333}
                tree={{
                    //zOffset: -1
                    visualizeTree: false
                }}
            />

            */


        