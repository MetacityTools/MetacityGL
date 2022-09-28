import axios from "axios";
import { Graphics } from "../../../metacitygl/metacitygl"
import { NetworkData, PopulationData, PopulationLegendData } from "../data";


self.onmessage = async function(e) {
    const { networkAPI, legendAPI, populationAPI } = e.data;
    const network = (await axios.get(networkAPI)).data as NetworkData;
    const legend = (await axios.get(legendAPI)).data as PopulationLegendData;
    const population = (await axios.get(populationAPI)).data as PopulationData;

    const asm = new Graphics.Assemblers.AgentAssembler();
    for(const agentID in population.data.agents) {
        const agent = population.data.agents[agentID];
        const agentType = legend.data.agentTypes[agent.type];
        const color = Graphics.Color.colorStrToArr(agentType.color);
        asm.startAgent(color, {
            stringID: agentID,
            type: agent.type,
        });
        for(const movement of agent.movements) {
            const origin = network.data.nodes[movement.oid];
            const destination = network.data.nodes[movement.did];
            asm.addPosition(origin.x, origin.y, 0, movement.ti);
            asm.addPosition(destination.x, destination.y, 0, movement.tf);
        }
        asm.endAgent();
    }

    asm.toBuffers();
}