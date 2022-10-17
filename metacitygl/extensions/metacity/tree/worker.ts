


import { TreeConfig } from './types';
import axios from 'axios';
import { QuadTree, settings } from './tree';
import * as Utils from '../../../utils';


declare var self: any;


let tree: QuadTree;

//eslint-disable-next-line no-restricted-globals
self.onmessage = (message: MessageEvent) => {
    loadModel(message);
};

async function loadModel(message: any) {
    const data = message.data;

    if (data.api) {
        await initWorker(data.api, data.color, data.styles, data.treeConfig);
    } 
    
    if (data.position) {
        if (!tree)
            return;
            
        const geometry = constructModel(data.position);
        const transferable = geometry.array ? [geometry.array.buffer] : [];
        self.postMessage(geometry, transferable);
    }
}

async function initWorker(api: string, color: number, styles: string[], config: TreeConfig) {
    const meta = api + '/meta.json';
    const treedata = await axios.get(meta);
    const { data } = treedata;
    const arrColor = Utils.Color.colorHexToArr(color); 
    const stylesCls = [];
    for (let i = 0; i < styles.length; i++)
        stylesCls.push(Utils.Styles.Style.deserialize(styles[i]));

    settings.update(config);
    tree = new QuadTree({
        data, 
        bmin: data.border.min, 
        bmax: data.border.max,
        color: arrColor,
        styles: stylesCls,
    });
    console.log(tree);
    console.log(`Tree requires MAX ${tree.spaceRequired() / 1024 / 1024} MB`);
}

function constructModel(position: {x: number, y: number, z: number}) {
    const geometry = {
        array: settings.visualizeTree ? new Float32Array(tree.spaceRequired()) : undefined,
        filled: 0,
        tilesToLoad: []
    };

    tree.query(position, geometry);
    return geometry;
}




