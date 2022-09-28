import { Driver, DriverProps, Graphics } from "../../../metacitygl/metacitygl";
import Worker from './worker?worker&inline'


interface FluxPopulationDriverProps extends DriverProps {
    populationAPI: string;
    legendAPI: string;
    networkAPI: string;
    key?: string;
}

export class FluxPopulationDriver extends Driver<FluxPopulationDriverProps> {
    private populationAPI: string;
    private legendAPI: string;
    private networkAPI: string;

    constructor(props: FluxPopulationDriverProps) {
        super(props);
        const keySufix = props.key ? `?key=${props.key}` : '';
        this.populationAPI = props.populationAPI + keySufix;
        this.networkAPI = props.networkAPI + keySufix;
        this.legendAPI = props.legendAPI + keySufix;
    }

    async onInit() {
        const worker = new Worker();
        
        worker.onmessage = (e) => {
            console.log(e.data);
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