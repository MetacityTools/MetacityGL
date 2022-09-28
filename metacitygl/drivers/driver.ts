import * as THREE from "three";
import { MetacityGL } from "../metacitygl";

export interface DriverProps {
    engine: MetacityGL;
}


export abstract class Driver<Props extends DriverProps> {
    engine: MetacityGL;
    metadata: {[id: number]: any} = {};

    constructor(props: DriverProps) {
        this.engine = props.engine;
    }
    //make this assync when you implement it
    abstract onInit(): Promise<void>;
    //make this assync when you implement it
    abstract onViewUpdate(target: THREE.Vector3, position: THREE.Vector3): Promise<void>;
}