import { Driver, DriverProps, Graphics } from "../../../metacitygl/metacitygl";
import Worker from './worker?worker&inline'



export interface FluxLandUseDriverProps extends DriverProps {
    landuseAPI: string;
    legendAPI: string;
    key?: string;
    space?: number;
}


export class FluxLandUseDriver extends Driver<FluxLandUseDriverProps> {
    private landuseAPI: string;
    private legendAPI: string;
    private space: number = 5;

    constructor(props: FluxLandUseDriverProps) {
        super(props);
        const keySufix = props.key ? `?key=${props.key}` : '';
        this.landuseAPI = props.landuseAPI + keySufix;
        this.legendAPI = props.legendAPI + keySufix;
        this.space = props.space || this.space;
    }

    async onInit() {
        const worker = new Worker();
        
        worker.onmessage = (e) => {
            const { meshBuffers, lineBuffers } = e.data;
            const meshModel = Graphics.Models.MeshModel.create(meshBuffers);
            meshModel.translateZ(-0.5);
            meshModel.updateMatrix();
            this.engine.addModel(meshModel);

            const lineModel = Graphics.Models.LineModel.create(lineBuffers, {
                thickness: 2,
            });
            lineModel.translateZ(-0.5);
            lineModel.updateMatrix();
            this.engine.addModel(lineModel);

        };

        worker.postMessage({
            landuseAPI: this.landuseAPI,
            legendAPI: this.legendAPI,
            space: this.space,
        });
    }

    async onViewUpdate(target: THREE.Vector3, position: THREE.Vector3) {
        //pass
    }
}