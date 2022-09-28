import React from 'react';
import axios from 'axios';
import * as Drivers from './flux/drivers'

interface ColormapProps {
    driver: Drivers.FluxNetworkDriver,
    populationLegendAPI: string,
    apiKey: string
}


export function NetworkColormap(props: ColormapProps) {
    const [types, setTypes] = React.useState<string[]>([]);

    const key = props.apiKey ? "?key=" + props.apiKey : "";
    const url = props.populationLegendAPI + key;

    React.useEffect(() => {
        axios.get(url).then((response) => {
            console.log(response.data);
            setTypes(Object.keys(response.data.data.agentTypes));
        });
    }, []);

    return (
        <div className="colormap">
            {types.map((type) => {
                return (
                    <div className="colormap-row" key={type}
                        onClick={(e) => {
                            props.driver.color(type);
                        }}>{type}
                    </div>
                )
            })}
            <div className="colormap-row"
                onClick={(e) => {
                    props.driver.defaultColor();
                }}>type</div>
        </div>
    );
}