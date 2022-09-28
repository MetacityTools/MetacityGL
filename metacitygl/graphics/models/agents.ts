import * as THREE from 'three';
import { GraphicsContext } from '../context';
import { AgentMaterial } from '../materials/agentMaterial';
import { AgentData, MovementData } from '../types';
import { Model } from './model';


type movementUniforms = {
    timeStart: number;
    timeEnd: number;
    shift: number;
}


class Movement extends THREE.InstancedMesh implements Model {
    timeStart: number | undefined;
    timeEnd: number | undefined;
    shift: number | undefined;

    static readonly defaultMaterial = new AgentMaterial();

    static create(data: MovementData, uniforms: movementUniforms) {
        const geometry = new THREE.InstancedBufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(data.instance.attributes.position.array, 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(data.instance.attributes.normal.array, 3));
        geometry.setAttribute('color', data.colors);
        geometry.setAttribute('dimensions', data.dimensions);
        geometry.setAttribute('positionStart', data.attrStart);
        geometry.setAttribute('positionEnd', data.attrEnd);
        geometry.setAttribute('visible', data.attrVisible);

        const mesh = new Movement(geometry, Movement.defaultMaterial, data.attrStart.count);
        mesh.frustumCulled = false;
        mesh.matrixAutoUpdate = false;
        mesh.timeStart = uniforms.timeStart;
        mesh.timeEnd = uniforms.timeEnd;
        mesh.shift = uniforms.shift;

        mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
            (material as THREE.ShaderMaterial).uniforms.shift.value = uniforms.shift;
            (material as THREE.ShaderMaterial).uniforms.timeStart.value = uniforms.timeStart;
            (material as THREE.ShaderMaterial).uniforms.timeEnd.value = uniforms.timeEnd;
            (material as THREE.ShaderMaterial).uniforms.time.value = scene.userData.time;
            (material as THREE.ShaderMaterial).uniformsNeedUpdate = true;
        }

        return mesh;
    }

    toPickable(): void {
        this.visible = false;
    }

    onAdd(context: GraphicsContext) {
        //pass
    }

    updateVisibility(time: number) {
        if (this.timeStart === undefined || this.timeEnd === undefined)
            return;
        this.visible = time > this.timeStart && time < this.timeEnd;
    }
}


type uniforms = {
    size: number;
}

export class AgentModel extends THREE.Group implements Model {
    timeframe: [number, number] | undefined;

    static create(data: AgentData, uniforms: uniforms) {   
        const instance = new THREE.BoxGeometry(uniforms.size, uniforms.size, uniforms.size).toNonIndexed();
        instance.translate(0, 0, uniforms.size * 0.5);
        const attrPos = [], attrVis = [];
        for(let i = 0; i < data.positions.length; i++){
            attrPos.push(new THREE.InstancedBufferAttribute(data.positions[i], 3, false, 1));
            attrVis.push(new THREE.InstancedBufferAttribute(data.visible[i], 1, false, 1));
        }
        const colors = new THREE.InstancedBufferAttribute(data.colors, 3, false, 1);
        const dimensions = new THREE.InstancedBufferAttribute(data.dimensions, 3, false, 1);
        const group = new AgentModel();
        group.timeframe = [data.timestamps[0], data.timestamps[data.timestamps.length - 1]];

        for (let i = 0; i < data.positions.length - 1; i++) {
            const movement = Movement.create({
                instance,
                colors,
                dimensions,
                attrStart: attrPos[i],
                attrEnd: attrPos[i + 1],
                attrVisible: attrVis[i],
            }, {
                timeStart: data.timestamps[i],
                timeEnd: data.timestamps[i + 1],
                shift: 10,
            });
            group.add(movement);
        }

        return group;
    }

    toPickable(): void {
        this.children.forEach(child => {
            (child as Movement).toPickable();
        });
    }

    onAdd(context: GraphicsContext) {
        context.onBeforeFrame = (time) => {
            //this could be improved by A LOT by keeping track of the last visible interval
            this.children.forEach(child => {
                (child as Movement).updateVisibility(time);
            });
        }
        if(this.timeframe !== undefined) 
            context.timeframe = this.timeframe;
    }
}