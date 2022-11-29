import { load }  from '@loaders.gl/core';
import { GLTFLoader } from '@loaders.gl/gltf';
import { computeDots } from './normals';


export async function loadGLTF(model: string) {
    const gltf = await load(model, GLTFLoader);
    const positions: number[] = [];

    for(let i = 0; i < gltf.meshes.length; i++) {
        const model = gltf.meshes[i];

        for(let j = 0; j < model.primitives.length; j++) {
            const attr = model.primitives[j].attributes.POSITION;
            const buffer = attr.value;
            const type = model.primitives[j].mode ?? 4;
            const indices = model.primitives[j].indices?.value ?? undefined;  

            if (type === 4) {
                if (indices !== undefined) {
                    for(let k = 0; k < indices.length; k++) {
                        const index = indices[k] * 3;
                        positions.push(buffer[index], buffer[index + 1], buffer[index + 2]);
                    }
                } else {
                    for(let k = 0; k < buffer.length; k += 3) {
                        positions.push(buffer[k], buffer[k + 1], buffer[k + 2]);
                    }
                }
            }
        }
    }
    
    const posArr = new Float32Array(positions);
    const dots = computeDots(positions);

    return {
        positions: posArr,
        dots: dots
    }
}