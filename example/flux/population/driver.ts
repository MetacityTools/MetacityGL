import { Driver, DriverProps, Graphics } from "../../../metacitygl/metacitygl";
import Worker from './worker?worker&inline'


interface FluxPopulationDriverProps extends DriverProps {
    populationAPI: string;
    legendAPI: string;
    networkAPI: string;
    key?: string;
    agentSize?: number;
}

export class FluxPopulationDriver extends Driver<FluxPopulationDriverProps> {
    private populationAPI: string;
    private legendAPI: string;
    private networkAPI: string;
    private agentSize: number;

    constructor(props: FluxPopulationDriverProps) {
        super(props);
        const keySufix = props.key ? `?key=${props.key}` : '';
        this.populationAPI = props.populationAPI + keySufix;
        this.networkAPI = props.networkAPI + keySufix;
        this.legendAPI = props.legendAPI + keySufix;
        this.agentSize = props.agentSize || 10;
    }

    async onInit() {
        const worker = new Worker();
        
        worker.onmessage = (e) => {
            const model = Graphics.Models.AgentModel.create(e.data, {
                size: this.agentSize,
            });

            this.engine.addModel(model, false);
        };

        worker.postMessage({
            populationAPI: this.populationAPI,
            networkAPI: this.networkAPI,
            legendAPI: this.legendAPI,
        });
    }

    async onViewUpdate(target: THREE.Vector3, position: THREE.Vector3) {
        //pass
    }
}