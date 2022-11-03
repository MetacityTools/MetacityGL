import React from 'react'
import './App.css'
import { MetacityGL, Utils, Extensions } from '../metacitygl/metacitygl';

function App() {
    const terrain = 0x333333;
    const oldBuild = 0x666666;
    const newBuild = 0x00FF00;
    const rails = 0x555555;

    return (
        <MetacityGL
            //background={0x151d29}
            background={0x111111}
            target={[-742921, -1043242, 0]}
            antialias
            >
            
            <Extensions.MetacityTreeLayer
                api="https://data.metacity.cc/pragueBuildingTree"
                color={oldBuild}
                tree={{
                }}
            />
            <Extensions.MetacityTreeLayer
                api="https://data.metacity.cc/pragueTerrainTree"
                color={0x333333}
                tree={{
                }}
            />
            <Extensions.MetacityTreeLayer
                api="https://data.metacity.cc/pragueBridgesTree"
                color={rails}
                tree={{
                    visualizeTree: false
                }}
            />
            <Extensions.MetacityTreeLayer
                api="https://data.metacity.cc/pragueTreesTree"
                instance="/tree.glb"
                size={20}
                swapDistance={4000}
                color={0x888888}
                tree={{
                    visualizeTree: false
                }}
            />
            <Extensions.MetacityTreeLayer
                api="https://data.metacity.cc/pragueFilharmonieTree"
                //color={0xf7b500}
                color={0xFF27FB}
                tree={{
                }}
            />
            <Extensions.MetacityTreeLayer
                api="https://data.metacity.cc/pragueBubnyTree"
                color={0xeeeeee}
                tree={{
                    visualizeTree: false
                }}
                skipObjects={[194, 193, 172, 173, 195]}
                styles={[
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - vltava'}))                      .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - terén - chodník'}))             .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - terén - zeleň'}))               .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - terén - silnice'}))             .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - terén - parkovací stání'}))     .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - terén'}))                       .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - opěrné zdi'}))                  .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - objekty - schodiště'}))         .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - střechy - původní'}))           .useColor(oldBuild),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - objekty - původní'}))           .useColor(oldBuild),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - objekty - základové desky - původ'}))      .useColor(oldBuild),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - objekty - navrhované'}))                   .useColor(newBuild),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - střechy - navrhované'}))                   .useColor(newBuild),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - objekty - základové desky - navrho'}))     .useColor(newBuild),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - Trať'}))             .useColor(rails),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - Kladenská trať'}))   .useColor(rails),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - Kralupská trať'}))   .useColor(rails),
                ]}

            />
        </MetacityGL>
    )
}

export default App


/*
<Extensions.MetacityTreeLayer
                api="https://data.metacity.cc/pragueBubnyTree"
                color={0xeeeeee}
                tree={{
                    visualizeTree: false
                }}
                styles={[
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - vltava'}))                      .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - terén - chodník'}))             .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - terén - zeleň'}))               .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - terén - silnice'}))             .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - terén - parkovací stání'}))     .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - terén'}))                       .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - opěrné zdi'}))                  .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - objekty - schodiště'}))         .useColor(terrain),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - střechy - původní'}))           .useColor(oldBuild),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - objekty - původní'}))           .useColor(oldBuild),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - objekty - základové desky - původ'}))      .useColor(oldBuild),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - objekty - navrhované'}))                   .useColor(newBuild),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - střechy - navrhované'}))                   .useColor(newBuild),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - objekty - základové desky - navrho'}))     .useColor(newBuild),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - Trať'}))             .useColor(rails),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - Kladenská trať'}))   .useColor(rails),
                    new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: 'autocad_la', value: 'U- 02 Model - Kralupská trať'}))   .useColor(rails),
                ]}

            />


            */


        