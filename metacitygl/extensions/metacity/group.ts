export interface Model {
    positions: Float32Array,
    meta: any,
}


export interface ModelGroups {
    points: Model[], 
    meshes: Model[]
}


export function groupBuffersByType(gltf: any) : ModelGroups {
    const groups: ModelGroups = {
        points: [],
        meshes: []
    };

    for(let i = 0; i < gltf.meshes.length; i++) {
        const model = gltf.meshes[i];
        const positions = model.primitives[0].attributes.POSITION;
        const buffer = positions.value;
        const meta = model.extras;
        const type = model.primitives[0].mode;

        if (type === 0) {
            groups.points.push({
                positions: buffer,
                meta,
            });
        }

        if (type === 4) {
            groups.meshes.push({
                positions: buffer,
                meta,
            });
        }
    }
    
    return groups;
}
