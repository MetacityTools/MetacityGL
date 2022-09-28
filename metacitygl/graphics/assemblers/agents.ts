import { vec3 } from "../types";
import { colorHex } from "../utils/color";

enum AgentAssemblerState {
    Idle,
    BuildingAgent
};

interface Timestamp {
    x: number;
    y: number;
    z: number;
    time: number;
}

export class AgentAssembler {
    colors: number[] = [];
    ids: number[] = [];
    metadata: {[id: number]: any} = {};

    times: Set<number> = new Set();
    agentMatrix: Timestamp[][] = [];
    agent: Timestamp[] = [];
    state: AgentAssemblerState = AgentAssemblerState.Idle;

    static readonly type = "agents";  

    constructor(private id = 1) {}

    startAgent(rgb: number[], metadata: any) {
        if (this.state != AgentAssemblerState.Idle) {
            throw new Error("AgentAssembler: cannot start agent while building another");
        }

        this.state = AgentAssemblerState.BuildingAgent;
        this.agent = [];
        this.colors.push(rgb[0], rgb[1], rgb[2]);
        const idcolor = colorHex(this.id);
        this.ids.push(idcolor[0], idcolor[1], idcolor[2]);
        this.metadata[this.id] = metadata;
    }

    addPosition(x: number, y: number, z: number, time: number) {
        if (this.state != AgentAssemblerState.BuildingAgent) {
            throw new Error("AgentAssembler: cannot add position while not building an agent");
        }

        this.agent.push({x, y, z, time});
        this.times.add(time);
    }
    
    endAgent() {
        if(this.state != AgentAssemblerState.BuildingAgent) {
            throw new Error("AgentAssembler: cannot end agent while not building one");
        }

        this.state = AgentAssemblerState.Idle;
        this.agent.sort((a, b) => a.time - b.time);
        this.agentMatrix.push(this.agent);
        this.id++;
    }

    toBuffers() {
        const sortedTimestamps = Array.from(this.times).sort((a, b) => a - b);
        const positions: Float32Array[] = [];
        for(const agentTimeline of this.agentMatrix) {
            const agentPositions: number[] = [];
            let step = agentTimeline[0];
            let lastStep: Timestamp | undefined = undefined;
            for(let t = 0; t < sortedTimestamps.length; t++) {
                const time = sortedTimestamps[t];
                if (step.time > time) {
                    if (lastStep == undefined)
                        agentPositions.push(step.x, step.y, 0);
                    else {
                        const alpha = (time - lastStep.time) / (step.time - lastStep.time);
                        const x = lastStep.x + alpha * (step.x - lastStep.x);
                        const y = lastStep.y + alpha * (step.y - lastStep.y);
                        const z = lastStep.z + alpha * (step.z - lastStep.z);
                        agentPositions.push(x, y, z);
                    }
                } else if (step.time == time) {
                    agentPositions.push(step.x, step.y, 0);
                    lastStep = step;
                    if (t < agentTimeline.length - 1)
                        step = agentTimeline[t + 1];
                } else {
                    agentPositions.push(step.x, step.y, 0);
                }
            }
            positions.push(new Float32Array(agentPositions));
        }

        console.log(positions);
        return {
            positions,
            colors: new Float32Array(this.colors),
            ids: new Float32Array(this.ids),
            timestamps: new Float32Array(sortedTimestamps),
            metadata: this.metadata,
        }
    }
}