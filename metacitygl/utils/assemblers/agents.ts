import { colorHexToArr } from "../utils/color";

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
    //ids: number[] = [];
    dimensions: number[] = [];
    metadata: { [id: number]: any } = {};

    times: Set<number> = new Set();
    agentMatrix: Timestamp[][] = [];
    agent: Timestamp[] = [];
    defaultPositions: number[][] = [];
    state: AgentAssemblerState = AgentAssemblerState.Idle;

    static readonly type = "agents";

    constructor(private id = 1) { }

    get empty() {
        return this.state == AgentAssemblerState.Idle && this.agentMatrix.length == 0;
    }

    startAgent(rgb: number[], dimensions: number[], metadata: any, x: number, y: number, z: number) {
        if (this.state != AgentAssemblerState.Idle) {
            throw new Error("AgentAssembler: cannot start agent while building another");
        }

        this.state = AgentAssemblerState.BuildingAgent;
        this.agent = [];
        this.colors.push(rgb[0], rgb[1], rgb[2]);
        this.dimensions.push(...dimensions);
        const idcolor = colorHexToArr(this.id);
        //this.ids.push(idcolor[0], idcolor[1], idcolor[2]);
        this.metadata[this.id] = metadata;

        //to make the aggent appear
        this.defaultPositions.push([x, y, z]);
    }

    addPosition(x: number, y: number, z: number, time: number, visible: boolean) {
        if (this.state != AgentAssemblerState.BuildingAgent) {
            throw new Error("AgentAssembler: cannot add position while not building an agent");
        }

        this.agent.push({ x, y, z, time, visible });
        this.times.add(time);
    }

    endAgent() {
        if (this.state != AgentAssemblerState.BuildingAgent) {
            throw new Error("AgentAssembler: cannot end agent while not building one");
        }

        this.state = AgentAssemblerState.Idle;
        //TEMPORARY FIX
        //this.agent.sort((a, b) => a.time - b.time);
        this.agentMatrix.push(this.agent);
        this.id++;
    }

    toBuffers() {
        if (this.empty)
            return undefined;

        const sortedTimestamps = Array.from(this.times).sort((a, b) => a - b);
        let positions: number[][] = [];
        let visible: number[][] = [];
        let agentID = 0;
        for (const agentTimeline of this.agentMatrix) {
            const agentPositions: number[] = [];
            const agentVisibility: number[] = [];

            if (agentTimeline.length == 0) {
                //agent without movement, copy the default position
                for (let t = 0; t < sortedTimestamps.length; t++) {
                    agentPositions.push(...this.defaultPositions[agentID]);
                    agentVisibility.push(1);
                }
            } else {
                let stepIdx = 0;
                let step = agentTimeline[stepIdx];
                let lastStep: Timestamp | undefined = undefined;
                for (let t = 0; t < sortedTimestamps.length; t++) {
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
                        //TEMPORARY FIX
                        //while (step.time == time && stepIdx < agentTimeline.length - 1) {
                        while (step.time <= time && stepIdx < agentTimeline.length - 1) {
                            lastStep = step;
                            step = agentTimeline[stepIdx + 1];
                            stepIdx++;
                        }
                    } else {
                        agentPositions.push(step.x, step.y, 0);
                        agentVisibility.push(step.visible ? 1 : 0);
                    }
                }
            }
            positions.push(agentPositions);
            visible.push(agentVisibility);
            agentID++;
        }

        const invertedPos = this.invertTimelineToTimeMajor(positions, 3);
        (positions as any) = null;
        const visibleVis = this.invertTimelineToTimeMajor(visible, 1);
        (visible as any) = null;

        return {
            positions: invertedPos,
            visible: visibleVis,
            timestamps: new Float32Array(sortedTimestamps),
            dimensions: new Float32Array(this.dimensions),
            colors: new Uint8Array(this.colors),
            //ids: new Float32Array(this.ids),
            metadata: this.metadata,
        }
    }

    pickTransferables(buffers: any) {
        if (buffers == undefined)
            return [];
            
        const transferables: Float32Array[] = [];
        for (let i = 0; i < buffers.positions.length; i++)
            transferables.push(buffers.positions[i].buffer);
        for (let i = 0; i < buffers.visible.length; i++)
            transferables.push(buffers.visible[i].buffer);
        transferables.push(buffers.timestamps.buffer);
        transferables.push(buffers.dimensions.buffer);
        transferables.push(buffers.colors.buffer);
        //transferables.push(buffers.ids.buffer);
        return transferables;
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