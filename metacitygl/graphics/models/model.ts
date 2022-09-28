import THREE from "three";


export abstract class Model extends THREE.Mesh {
    static create(data: any, uniforms: any): THREE.Mesh {
        throw new Error("Static method create(data: any, uniforms: any) not implemented.");
    };
    
    abstract toPickable(): void;
} 
