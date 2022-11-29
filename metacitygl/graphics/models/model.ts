import * as THREE from "three";
import { GraphicsContext } from "../context";


export interface Model extends THREE.Object3D {
    timeSensitive: boolean;
    toPickable: () => void;
    onAdd: (context: GraphicsContext) => void;
    _uniforms?: any;
}

export interface RenderableModel extends Model {
    set uniforms(values: any);
}

function updateUniforms(model: RenderableModel, values: any) {
    for(let key in values) {
        model._uniforms[key] = values[key];
    }
}

function onBeforeRender(model: RenderableModel, renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, geometry: THREE.BufferGeometry, material: THREE.Material, group: THREE.Group) {    
    if (Object.keys(model._uniforms).length > 0) {
        for(let key in model._uniforms) {
            if (key in (material as THREE.ShaderMaterial).uniforms) 
                (material as THREE.ShaderMaterial).uniforms[key].value = model._uniforms[key];
        }

        if (model.timeSensitive)
            (material as THREE.ShaderMaterial).uniforms.time.value = scene.userData.time;
        (material as THREE.ShaderMaterial).uniformsNeedUpdate = true;
    }    
}


//THREE.Mesh
export class BaseMeshModel extends THREE.Mesh implements RenderableModel {
    timeSensitive = false;
    _uniforms: {[key: string]: any} = {};

    static create(data: any, uniforms: any): THREE.Object3D {
        throw new Error("Static method create(data: any, uniforms: any) not implemented.");
    };

    toPickable() {
        throw new Error("Method toPickable() not implemented.");
    };

    onAdd(context: GraphicsContext) {
        //no update, feel free to override
    };

    set uniforms(values: any) {
        updateUniforms(this, values);
    }

    onBeforeRender = (r: THREE.WebGLRenderer, s: THREE.Scene, c: THREE.Camera, b: THREE.BufferGeometry, m: THREE.Material, g: THREE.Group) => {
        onBeforeRender(this, r, s, c, b, m, g);   
    };
}

//THREE.InstancedMesh
export class BaseInstancedModel extends THREE.InstancedMesh implements RenderableModel {
    timeSensitive = false;
    _uniforms: {[key: string]: any} = {};

    static create(data: any, uniforms: any): THREE.Object3D {
        throw new Error("Static method create(data: any, uniforms: any) not implemented.");
    };

    toPickable() {
        throw new Error("Method toPickable() not implemented.");
    };

    onAdd(context: GraphicsContext) {
        //no update, feel free to override
    };

    set uniforms(values: any) {
        updateUniforms(this, values);
    }

    onBeforeRender = (r: THREE.WebGLRenderer, s: THREE.Scene, c: THREE.Camera, b: THREE.BufferGeometry, m: THREE.Material, g: THREE.Group) => {
        onBeforeRender(this, r, s, c, b, m, g);   
    };
}

//THREE.Group
export class BaseGroupModel extends THREE.Group implements Model {
    timeSensitive = false;

    static create(data: any, uniforms: any): THREE.Object3D {
        throw new Error("Static method create(data: any, uniforms: any) not implemented.");
    };

    toPickable() {
        throw new Error("Method toPickable() not implemented.");
    };

    onAdd(context: GraphicsContext) {
        //no update, feel free to override
    };
}

