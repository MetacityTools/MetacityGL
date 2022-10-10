import * as THREE from 'three';
import { AgentData, MovementData } from '../../utils/types';
import { GraphicsContext } from '../context';
import { AgentMaterial } from '../materials/agentMaterial';
import { BaseGroupModel, BaseInstancedModel } from './model';


type movementUniforms = {
    timeStart: number;
    timeEnd: number;
    shift: number;
}


class Movement extends BaseInstancedModel {
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

        const mesh = new Movement(geometry, Movement.defaultMaterial, 0);
        mesh.count = data.attrStart.count;
        mesh.frustumCulled = false;
        mesh.matrixAutoUpdate = false;
        mesh.timeStart = uniforms.timeStart;
        mesh.timeEnd = uniforms.timeEnd;
        mesh.shift = uniforms.shift;
        mesh.instanceMatrix = new THREE.InstancedBufferAttribute(new Float32Array(0), 0);
        mesh.uniforms = uniforms;
        mesh.timeSensitive = true;
        return mesh;
    }

    toPickable(): void {
        this.visible = false;
    }

    updateVisibility(time: number) {
        this.visible = this.timeStart! <= time && time < this.timeEnd!;
        return this.visible;
    }
}


type uniforms = {
    size: number;
}

export class AgentModel extends BaseGroupModel {
    timeframe: [number, number] | undefined;
    lastVisible: Movement | undefined;
    movementArrayTimeSorted: Movement[] = [];

    static create(data: AgentData, uniforms: uniforms) {
        const instance = new THREE.BoxGeometry(uniforms.size, uniforms.size, uniforms.size).toNonIndexed();
        instance.translate(0, 0, uniforms.size * 0.5);
        const attrPos = [], attrVis = [];
        for (let i = 0; i < data.positions.length; i++) {
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
            movement.visible = false;
            group.add(movement);
            group.movementArrayTimeSorted.push(movement);
        }

        return group;
    }

    toPickable(): void {
        this.children.forEach(child => {
            (child as Movement).toPickable();
        });
    }

    onAdd(context: GraphicsContext) {
        context.onBeforeFrame = async (time) => {
            const active = this.binarySearchMovement(time);
            if (active) {
                if (active !== this.lastVisible) {
                    if (this.lastVisible) {
                        this.lastVisible.visible = false;
                    }
                    active.visible = true;
                    this.lastVisible = active;
                }
            } else {
                this.children.forEach(child => {
                    (child as Movement).updateVisibility(time);
                });
            }
        }

        if (this.timeframe !== undefined)
            context.timeframe = this.timeframe;
    }

    binarySearchMovement(time: number): Movement | undefined {
        let l = 0;
        let r = this.movementArrayTimeSorted.length - 1;
        while (l <= r) {
            const m = Math.floor((l + r) / 2);
            const movement = this.movementArrayTimeSorted[m];
            if (movement.timeStart! <= time && time < movement.timeEnd!) {
                return movement;
            } else if (movement.timeEnd! <= time) {
                l = m + 1;
            } else {
                r = m - 1;
            }
        }
        return undefined;
    }
}
