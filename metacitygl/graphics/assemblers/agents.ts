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
    visible: boolean;
}

export class AgentAssembler {
    colors: number[] = [];
    ids: number[] = [];
    dimensions: number[] = [];
    metadata: {[id: number]: any} = {};

    times: Set<number> = new Set();
    agentMatrix: Timestamp[][] = [];
    agent: Timestamp[] = [];
    state: AgentAssemblerState = AgentAssemblerState.Idle;

    static readonly type = "agents";  

    constructor(private id = 1) {}

    get empty() {
        return this.state == AgentAssemblerState.Idle && this.agentMatrix.length == 0;
    }

    startAgent(rgb: number[], dimensions: number[], metadata: any) {
        if (this.state != AgentAssemblerState.Idle) {
            throw new Error("AgentAssembler: cannot start agent while building another");
        }

        this.state = AgentAssemblerState.BuildingAgent;
        this.agent = [];
        this.colors.push(rgb[0], rgb[1], rgb[2]);
        this.dimensions.push(...dimensions);
        const idcolor = colorHex(this.id);
        this.ids.push(idcolor[0], idcolor[1], idcolor[2]);
        this.metadata[this.id] = metadata;
    }

    addPosition(x: number, y: number, z: number, time: number, visible: boolean) {
        if (this.state != AgentAssemblerState.BuildingAgent) {
            throw new Error("AgentAssembler: cannot add position while not building an agent");
        }

        this.agent.push({x, y, z, time, visible});
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
        const positions: number[][] = [];
        const visible: number[][] = [];
        for(const agentTimeline of this.agentMatrix) {
            const agentPositions: number[] = [];
            const agentVisibility: number[] = [];
            let stepIdx = 0;
            let step = agentTimeline[stepIdx];
            let lastStep: Timestamp | undefined = undefined;
            for(let t = 0; t < sortedTimestamps.length; t++) {
                const time = sortedTimestamps[t];
                if (step.time > time) {
                    if (lastStep == undefined) {
                        agentPositions.push(step.x, step.y, 0);
                        agentVisibility.push(step.visible ? 1 : 0);
                    } else {
                        const alpha = (time - lastStep.time) / (step.time - lastStep.time);
                        const x = lastStep.x + alpha * (step.x - lastStep.x);
                        const y = lastStep.y + alpha * (step.y - lastStep.y);
                        const z = lastStep.z + alpha * (step.z - lastStep.z);
                        agentPositions.push(x, y, z);
                        agentVisibility.push(step.visible ? 1 : 0);
                    }
                } else if (step.time == time) {
                    agentPositions.push(step.x, step.y, 0);
                    agentVisibility.push(step.visible ? 1 : 0);
                    while (step.time == time && stepIdx < agentTimeline.length - 1) {
                        lastStep = step;
                        step = agentTimeline[stepIdx + 1];
                        stepIdx++;
                    }
                } else {
                    agentPositions.push(step.x, step.y, 0);
                    agentVisibility.push(step.visible ? 1 : 0);
                }
            }
            positions.push(agentPositions);
            visible.push(agentVisibility);
        }

        const invertedPos = this.invertTimelineToTimeMajor(positions, 3);
        const visibleVis = this.invertTimelineToTimeMajor(visible, 1);

        return {
            positions: invertedPos,
            visible: visibleVis,
            timestamps: new Float32Array(sortedTimestamps),
            dimensions: new Float32Array(this.dimensions),
            colors: new Float32Array(this.colors),
            ids: new Float32Array(this.ids),
            metadata: this.metadata,
        }
    }

    invertTimelineToTimeMajor(timeline: number[][], step: number = 3) {
        const positions = [];
        for (let i = 0; i < timeline[0].length; i += step) {
            const row = [];
            for (let j = 0; j < timeline.length; j++) {
                row.push(...timeline[j].slice(i, i + step));
            }
            positions.push(new Float32Array(row));
        }
        return positions;
    }
}