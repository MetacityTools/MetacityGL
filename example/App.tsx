import React from 'react'
import './App.css'
import { MetacityGL, Components } from '../metacitygl/metacitygl'
import * as Drivers from './flux/drivers'
import { NetworkColormap } from './NetworkColormap';

function App() {
    const [engine] = React.useState(new MetacityGL());

    const key = "10000";

    const [network] = React.useState(new Drivers.FluxNetworkDriver({ 
        engine,
        networkAPI: "http://flux.oncue.design/network",
        legendAPI: "http://flux.oncue.design/network-legend",
        countsAPI: "http://flux.oncue.design/counts",
        key: key,
        thickness: 20,
        space: 0.5
    }));
    
    React.useEffect(() => {
        engine.addDriver(network);

        const landuse = new Drivers.FluxLandUseDriver({
            engine,
            landuseAPI: "http://flux.oncue.design/landuse",
            legendAPI: "http://flux.oncue.design/landuse-legend",
            space: 2,
            key: key,
        });

        engine.addDriver(landuse);

        const population = new Drivers.FluxPopulationDriver({
            engine,
            populationAPI: "http://flux.oncue.design/population",
            legendAPI: "http://flux.oncue.design/population-legend",
            networkAPI: "http://flux.oncue.design/network",
            key: key,
            agentSize: 5,
        });

        engine.addDriver(population);

    }, [engine]);


    return (
        <div id="app">
            <Components.Visualization engine={engine} graphics={
                {   
                    background: 0x333333,
                    onHover: (id: number, metadata: any) => {
                        const element = document.createElement("div");
                        if (metadata.counts) {
                            for(let count in metadata.counts) {
                                const row = document.createElement("div");
                                row.style.display = "flex";
                                row.style.justifyContent = "space-between";
                                row.style.alignItems = "center";
                                row.style.padding = "2px";
                                const label = document.createElement("div");
                                label.innerHTML = count;
                                label.style.fontSize = "0.7em";
                                label.style.paddingRight = "5px";
                                row.appendChild(label);
                                const value = document.createElement("div");
                                value.innerHTML = metadata.counts[count];
                                row.appendChild(value);
                                element.appendChild(row);
                            }

                        }
                        element.style.background = "white";
                        element.style.padding = "0.5rem";
                        element.style.borderRadius = "0.5rem";
                        return element;
                    }
                }
            }>
                <Components.Timeline engine={engine} />
            </Components.Visualization>
            <NetworkColormap driver={network} populationLegendAPI="http://flux.oncue.design/population-legend" apiKey={key} />
        </div>
    )
}

export default App
