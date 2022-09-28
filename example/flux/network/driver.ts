import { Driver, DriverProps, Graphics } from "../../../metacitygl/metacitygl";
import Worker from './worker?worker&inline'



export interface FluxNetworkDriverProps extends DriverProps {
    networkAPI: string;
    legendAPI: string;
    countsAPI: string;
    key?: string;
    thickness?: number;
    space?: number;
}


export class FluxNetworkDriver extends Driver<FluxNetworkDriverProps> {
    private networkAPI: string;
    private legendAPI: string;
    private countsAPI: string;
    private thickness: number = 10;
    private space: number = 5;

    constructor(props: FluxNetworkDriverProps) {
        super(props);
        const keySufix = props.key ? `?key=${props.key}` : '';
        this.networkAPI = props.networkAPI + keySufix;
        this.legendAPI = props.legendAPI + keySufix;
        this.countsAPI = props.countsAPI + keySufix;
        this.thickness = props.thickness || this.thickness;
        this.space = props.space || this.space;
    }

    async onInit() {
        const worker = new Worker();
        
        worker.onmessage = (e) => {
            this.metadata = e.data.metadata;
            const model = Graphics.Models.DoubleLineModel.create(e.data, {
                thickness: this.thickness,
                space: this.space,
            });
            this.engine.addModel(model, true);
        };

        worker.postMessage({
            networkAPI: this.networkAPI,
            legendAPI: this.legendAPI,
            countsAPI: this.countsAPI
        });
    }

    async onViewUpdate(target: THREE.Vector3, position: THREE.Vector3) {
        //pass
    }
}