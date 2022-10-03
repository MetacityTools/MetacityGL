import THREE from "three";
import { GraphicsContext } from "../context";


export abstract class Model extends THREE.Object3D {
    static create(data: any, uniforms: any): THREE.Object3D {
        throw new Error("Static method create(data: any, uniforms: any) not implemented.");
    };
    
    abstract toPickable(): void;
    abstract onAdd(context: GraphicsContext): void;
} 

