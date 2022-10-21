import React from 'react'
import './App.css'
import { MetacityGL, Utils, Extensions } from '../metacitygl/metacitygl';

function App() {

    return (
        <MetacityGL
        //background={0x151d29}
        background={0xFFFFFF}
        target={[-742921, -1043242, 0]}
        invertColors
        antialias
        >
        <Extensions.MetacityTreeLayer
            api="https://data.metacity.cc/pragueTreesFlatTree"
            instance="/tree.glb"
            size={20}
            swapDistance={4000}
            color={0x1ae310}
            tree={{
                visualizeTree: false
            }}
        />
        <Extensions.MetacityTreeLayer
            api="https://data.metacity.cc/pragueBuildingFlatTree"
            color={0xFFFFFF}
            tree={{
                visualizeTree: false
            }}
        />
        <Extensions.MetacityTreeLayer
            api="https://data.metacity.cc/pragueUtilizationTree"
            pickable
            enableUI
            color={0x888}
            styles={[
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 100}))  .useColor(0xFFE5CC), //hospodářská půda
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 200}))  .useColor(0x049F22), //les
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 300}))  .useColor(0x0AD254), //"louky, zahrady"
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 400}))  .useColor(0x5EFC1E), //zeleň v zástavbě
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 401}))  .useColor(0x5EFC1E), //zeleň v zástavbě - veřejná zeleň
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 402}))  .useColor(0x5EFC1E), //zeleň v zástavbě - ostatní zeleň
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 403}))  .useColor(0x5EFC1E), //zeleň v zástavbě - vyhrazená
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 500}))  .useColor(0x66CCFF), //vodní plochy
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 501}))  .useColor(0x66CCFF), //"vodní plochy - řeka, potok"
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 502}))  .useColor(0x66CCFF), //"vodní plochy - rybník, jezírko"
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 503}))  .useColor(0x66CCFF), //"vodní plochy - vodní dílo, hráz"
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 504}))  .useColor(0x66CCFF), //vodní plochy - přístav
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 600}))  .useColor(0xEEEEEE), //zástavba
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 601}))  .useColor(0xEEEEEE), //zástavba - budovy
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 602}))  .useColor(0xEEEEEE), //zástavba - ostatní stavby
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 603}))  .useColor(0xEEEEEE), //zástavba - dvory
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 604}))  .useColor(0xEEEEEE), //zástavba - budovy z ortofotomap
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 700}))  .useColor(0xFCFCFC), //komunikace
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 701}))  .useColor(0x9fa6a7), //komunikace - silnice
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 702}))  .useColor(0xFCFCFC), //komunikace - chodník nebo parková cesta
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 703}))  .useColor(0xFCFCFC), //komunikace - cyklostezka
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 704}))  .useColor(0x9fa6a7), //komunikace - parkoviště
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 705}))  .useColor(0x9fa6a7), //komunikace - samostatné tramvajové těleso
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 800}))  .useColor(0xFCFCFC), //letiště
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 900}))  .useColor(0x5EFC1E), //rekreační plochy
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 901}))  .useColor(0xFCFCFC), //rekreační plochy - sportoviště
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 902}))  .useColor(0xFCFCFC), //rekreační plochy - ostatní
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 1000})) .useColor(0xDDDDDD), //ostatní plochy
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 1001})) .useColor(0xDDDDDD), //ostatní plochy - průmyslový areál
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 1002})) .useColor(0xDDDDDD), //ostatní plochy - ostatní
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 1003})) .useColor(0xFCFCFC), //"ostatní plochy - zpevněné plochy kolem zástavby, komunikací, vodních ploch"
                new Utils.Styles.Style().add(new Utils.Styles.StyleAttributeEqualTo({ attribute: "CTVUK_KOD", value: 1100})) .useColor(0xF2F2FF), //železnice
            ]}
            tree={{
                //visualizeTree: false
            }}
        >
            <div id="legend">
            </div>
        </Extensions.MetacityTreeLayer>
    </MetacityGL>
    )
}

export default App



        