import React from 'react'
import './App.css'
import { MetacityGL, Visualization } from '../metacitygl/metacitygl'
import * as Drivers from './flux/drivers'

function App() {
    const [engine] = React.useState(new MetacityGL());

    
    React.useEffect(() => {
        const network = new Drivers.FluxNetworkDriver({ 
            engine,
            networkAPI: "http://flux.oncue.design/network",
            legendAPI: "http://flux.oncue.design/network-legend",
            countsAPI: "http://flux.oncue.design/counts",
            key: "10000",
            thickness: 20,
            space: 0.5
        });

        engine.addDriver(network);

        const landuse = new Drivers.FluxLandUseDriver({
            engine,
            landuseAPI: "http://flux.oncue.design/landuse",
            legendAPI: "http://flux.oncue.design/landuse-legend",
            space: 2,
            key: "10000",
        });

        engine.addDriver(landuse);

        const population = new Drivers.FluxPopulationDriver({
            engine,
            populationAPI: "http://flux.oncue.design/population",
            legendAPI: "http://flux.oncue.design/population-legend",
            networkAPI: "http://flux.oncue.design/network",
            key: "10000",
        });

        engine.addDriver(population);

    }, [engine]);


    return (
        <div id="app">
            <Visualization engine={engine}/>
        </div>
    )
}

export default App
