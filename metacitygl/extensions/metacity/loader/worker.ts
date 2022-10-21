import { load } from '@loaders.gl/core';
import { GLTFLoader } from '@loaders.gl/gltf';
import { groupBuffersByType } from './group';
import { applyStyle } from './style';
import * as Utils from "../../../utils"
import { MetacityWorkerInput } from './types';


declare var self: any;

//eslint-disable-next-line no-restricted-globals
self.onmessage = (message: MessageEvent) => {
    loadModel(message);
};

async function loadModel(message: any) {
    const { url, idOffset, color, styles } = message.data as MetacityWorkerInput;
    const colorArr = Utils.Color.colorHexToArr(color);


    try {
        const gltf = await load(url, GLTFLoader);
        const groups = groupBuffersByType(gltf);
        const useMetadata = styles !== undefined && styles.length > 0;
        const meshASM = new Utils.Assemblers.MeshAssembler(idOffset, useMetadata);
        for (let i = 0; i < groups.meshes.length; i++) {
            const mesh = groups.meshes[i];
            mesh.meta["url"] = url;
            meshASM.addMesh(mesh.positions, colorArr, mesh.meta);
        }

        const pointsASM = new Utils.Assemblers.PointsAssembler(meshASM.idCounter);
        for (let i = 0; i < groups.points.length; i++) {
            const points = groups.points[i];
            points.meta["url"] = url;
            pointsASM.addPoints(points.positions, points.meta);
        }

        const pointBuffers = pointsASM.toBuffers();
        const meshBuffers = meshASM.toBuffers();

        if (styles.length > 0 && meshBuffers) {
            applyStyle(styles, color, meshBuffers.ids!, meshBuffers.colors, meshBuffers.metadata!);
        }

        const transferables = meshASM.pickTransferables(meshBuffers);
        transferables.push(...pointsASM.pickTransferables(pointBuffers));

        self.postMessage({
            mesh: meshBuffers,
            points: pointBuffers
        }, transferables);
    } catch (e) {
        console.error(e);
    }

}




