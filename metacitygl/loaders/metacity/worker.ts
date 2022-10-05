import { load }  from '@loaders.gl/core';
import { GLTFLoader } from '@loaders.gl/gltf';
import { groupBuffersByType } from './group';
import { applyStyle } from './style';
import * as Utils from "../../utils"
import { MetacityWorkerInput } from './types';


declare var self: any;

//eslint-disable-next-line no-restricted-globals
self.onmessage = (message: MessageEvent) => {
    loadModel(message);
};

async function loadModel(message: any) {
    const { url, idOffset } = message.data as MetacityWorkerInput;
    console.log("Loading model", url);
    const gltf = await load(url, GLTFLoader);
    const groups = groupBuffersByType(gltf);

    const meshASM = new Utils.Assemblers.MeshAssembler(idOffset);
    for(let i = 0; i < groups.meshes.length; i++) {
        const mesh = groups.meshes[i];
        meshASM.addMesh(mesh.positions, [1, 1, 1], mesh.meta);
    }

    //let meshColors: Float32Array | undefined;
    //if (styles.length > 0 && models.mesh && models.mesh.ids) {
    //    meshColors = applyStyle(styles, baseColor, models.mesh.ids, metadata);
    //}

    const meshBuffers = meshASM.toBuffers();
    const transferables = meshASM.pickTransferables(meshBuffers);

    self.postMessage({
        mesh: meshBuffers
    }, transferables);

}




