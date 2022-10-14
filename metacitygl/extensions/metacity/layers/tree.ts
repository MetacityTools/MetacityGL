import * as MetacityGL from "../../../metacitygl";
import TreeWorker from "../tree/worker?worker&inline"; 
import { TreeConfig, TreeWorkerOutput } from "../tree/types";
import { Layer } from "./base";
import { TreeLayerProps } from "../props";


export class TreeLayer extends Layer {
    treeWorker!: Worker;
    treeModel?: MetacityGL.Graphics.Models.TreeModel;

    treeConfig: TreeConfig;

    constructor(props: TreeLayerProps) {
        super(props);
        this.treeConfig = props.tree;
    }

    setup() {
        if (!this.context)
        return;

        this.treeWorker = new TreeWorker();
        this.treeWorker.onmessage = (event) => {
            const data = event.data as TreeWorkerOutput;
            this.updateView(data);
        };

        this.treeWorker.postMessage({
            api: this.api,
            color: this.color,
            styles: this.styles,
            position: {
                x: (this.context.navigation.target.x),
                y: (this.context.navigation.target.y),
                z:  this.context.navigation.position.distanceTo(this.context.navigation.target),
            },
            treeConfig: this.treeConfig,
        });

        this.context.onNavChange = (tar, pos) => {
            this.treeWorker.postMessage({
                position: {
                    x: tar.x,
                    y: tar.y,
                    z: tar.distanceTo(pos),
                }
            });
        }
    }

    updateView(data: TreeWorkerOutput) {
        if (!this.context)
        return;

        data.tilesToLoad.forEach((tile) => {
            let pch;
            if (tile.model.array) {
                pch = MetacityGL.Graphics.Models.TreeModel.create(tile.model as MetacityGL.Utils.Types.TreeData);
                this.context!.add(pch);
            }
            this.loadTile({
                size: tile.size,
                file: tile.name,
                placeholder: pch,
            });
        });

        if (this.treeModel) {
            this.treeModel.updateBuffer(data as MetacityGL.Utils.Types.TreeData);
        } else {
            if (data.array) 
            {
                const model = MetacityGL.Graphics.Models.TreeModel.create(data as MetacityGL.Utils.Types.TreeData);
                this.treeModel = model;
                this.context.add(model);
            }
        }
    }
}