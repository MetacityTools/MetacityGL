export interface NetworkData {
    apiVersion: string;
    resource: "network";
    data: {
        nodes: {
            [node_id: string]: {
                x: number;
                y: number;
                edges: string[]
            }
        },
        edges: {
            [edge_id: string]: {
                type: string,
                oid: string,
                did: string,
            }
        }
    }
}


export interface NetworkLegendData {
    apiVersion: string;
    resource: "network-legend";
    data: {
        edgeTypes: {
            [edgeType: string]: {
                speed: number,
                width: number,
                description: string,
                capacity: number,
                sidewalk: boolean,
                color: string,
            }
        }
    }
}


export interface LandUseData {
    apiVersion: string;
    resource: "landuse";
    data: {
        areas: {
            [area_id: string]: {
                area: number,
                boundary: {
                    x: number,
                    y: number,
                }[],
                population: number,
                tiles: {
                    rotation: number,
                    x: number,
                    y: number,
                    width: number,
                }[],
                use: string,
            },
        }
    }
}

export interface LandUseLegendData {
    apiVersion: string;
    resource: "landuse-legend";
    data: {
        useTypes: {
            [useType: string]: {
                color: string,
                description: string,
                label: string,
            }
        }
    }
}


export interface PopulationData {
    apiVersion: string;
    resource: "population";
    data: {
        agents: {
            [agent_id: string]: {
                movements: {
                    tf: number;
                    ti: number;
                    oid: string;
                    did: string;
                    embarked: boolean;
                }[],
                oid: string,
                type: string,
            }
        }
    }
}


export interface PopulationLegendData {
    apiVersion: string;
    resource: "population-legend";
    data: {
        agentTypes: {
            [agentType: string]: {
                color: string,
                height: number,
                length: number,
                width: number,
                description: string,
            }
        }
    }
}


export interface CountsData {
    apiVersion: string;
    resource: "counts";
    data: {
        [edge_id: string]: {
            [mode: string]: number
        }
    }
}


