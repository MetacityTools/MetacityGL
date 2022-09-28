import { Driver, DriverProps, Graphics } from "../../../metacitygl/metacitygl";
import Worker from './worker?worker&inline'
import WorkerColor from './workerColor?worker&inline'



export interface FluxNetworkDriverProps extends DriverProps {
    networkAPI: string;
    legendAPI: string;
    countsAPI: string;
    key?: string;
    thickness?: number;
    space?: number;
}


export class FluxNetworkDriver extends Driver<FluxNetworkDriverProps> {
    readonly networkAPI: string;
    readonly legendAPI: string;
    readonly countsAPI: string;
    private thickness: number = 10;
    private space: number = 5;

    private model: Graphics.Models.DoubleLineModel | undefined; 

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
            this.model = model;
            this.engine.addModel(model, true);
            worker.terminate();
        };

        worker.postMessage({
            networkAPI: this.networkAPI,
            legendAPI: this.legendAPI,
            countsAPI: this.countsAPI
        });


        //add global grid
        const grid = Graphics.Models.GridModel.create({
            from: [-100000, -100000],
            to: [100000, 100000],
            z: -5,
            major: 1000,
            divideMajor: 10,
            color: 0x000000
        }, {
            thickness: 10
        });

        this.engine.addModel(grid, false);
    }

    async onViewUpdate(target: THREE.Vector3, position: THREE.Vector3) {
        //pass
    }

    color(countAttrib: string) {
        const worker = new WorkerColor();
        worker.onmessage = (e) => {
            console.log(e.data);
            this.model?.setColors(e.data.colors);
        }

        worker.postMessage({
            metadata: this.metadata,
            countAttrib,
            ids: this.model?.geometry.getAttribute('idcolor')?.array
        });
    }

    defaultColor() {
        this.model?.restoreColors();
    }
}