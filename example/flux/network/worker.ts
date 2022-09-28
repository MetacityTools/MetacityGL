import axios from "axios";
import { Graphics } from "../../../metacitygl/metacitygl"
import { NetworkData, NetworkLegendData, CountsData } from "../data";


self.onmessage = async function(e) {
    const { networkAPI, legendAPI, countsAPI } = e.data;
    const network = (await axios.get(networkAPI)).data as NetworkData;
    const legend = (await axios.get(legendAPI)).data as NetworkLegendData;
    const counts = (await axios.get(countsAPI)).data as CountsData;
    
    const colorTypeMap = colorMap(legend);
    const asm = new Graphics.Assemblers.LineAssembler();
    const tmp = new Graphics.Types.vec3();
    const tmp2 = new Graphics.Types.vec3();
    let zOffset = 0;

    for (const edgeID in network.data.edges) {
        const edge = network.data.edges[edgeID];
        const origin = network.data.nodes[edge.oid];
        const destination = network.data.nodes[edge.did];
        const color = colorTypeMap[edge.type];
        asm.addEdge(
            tmp.set(origin.x, origin.y, zOffset),
            tmp2.set(destination.x, destination.y, zOffset),
            color,
            {
                stringID: edgeID,
                counts: counts.data[edgeID],
            }
        );

        zOffset += 0.000001;
    }

    const response = asm.toBuffers();
    self.postMessage(response);
}

function colorMap(legend: NetworkLegendData) {
    const edgeTypes = legend.data.edgeTypes;
    const colorTypeMap: { [key: string]: number[]; } = {};
    for (const edgeType in edgeTypes) {
        const color = edgeTypes[edgeType].color;
        colorTypeMap[edgeType] = Graphics.Color.colorStrToArr(color);
    }
    return colorTypeMap;
}