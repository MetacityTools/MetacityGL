import { MetacityLoaderOutput } from "../loader/types";
import * as MetacityGL from "../../../metacitygl";
import { LayerProps } from "../props";


export interface MetacityTile {
    file: string;
    size: number;
    loaded?: boolean;
    placeholder?: MetacityGL.Graphics.Models.Model;
}

export interface LayoutMetacityTile extends MetacityTile {
    x: number;
    y: number;
}

interface InstancedPointsUniforms {
    size: number;
    modelColor: [number, number, number];
    swapDistance: number;
};


export class Layer {
    context?: MetacityGL.Graphics.GraphicsContext;
    api: string;
    pickable?: boolean;
    color: number;
    colorPlaceholder: number;
    styles: string[] = [];
    radius: number;
    size: number;
    swapDistance: number;
    instance?: string;
    instanceModel?: MetacityGL.Utils.Types.InstanceData;
    skipObjects: number[];

    constructor(props: LayerProps) {
        this.api = props.api;
        this.pickable = props.pickable;
        this.color = props.color || 0x000000;
        this.colorPlaceholder = props.colorPlaceholder || 0x000000;
        
        if (props.styles) {
            for (let style of props.styles) {
                this.styles.push(style.serialize());
            }
        }
        
        this.skipObjects = props.skipObjects || [];
        this.radius = props.radius ?? 2500;
        this.size = props.size ?? 1;
        this.swapDistance = props.swapDistance ?? 1000;
        this.instance = props.instance;
    }
    
    loadTile(tile: MetacityTile) {
        if (!this.context)
            return;
        this.context.services.metacity.loader.load({
            url: this.api + "/" + tile.file,
            tileSize: tile.size,
            color: this.color,
            styles: this.styles,
            skipObjects: this.skipObjects,
        }, (data: MetacityLoaderOutput) => {
            if (tile.placeholder)
                this.context?.remove(tile.placeholder);
            this.addMesh(data);
            this.addPoints(data);
        });
    }
    
    private addPoints(data: MetacityLoaderOutput) {
        if (!this.context)
            return;

        if (data.points) {
            const unfs = {
                size: this.size,
                modelColor: MetacityGL.Utils.Color.colorHexToArr(this.color),
                swapDistance: this.swapDistance,
            };

            if (this.instanceModel) {
                this.addInstancedPoints(data, unfs);
            } else {
                const points = MetacityGL.Graphics.Models.PointModel.create(data.points, unfs);
                this.context.add(points);
            }
        }
    }
    
    private addInstancedPoints(data: MetacityLoaderOutput, unfs: InstancedPointsUniforms) {
        if (!this.instanceModel)
            return;

        if (!this.context)
            return;

        const points = MetacityGL.Graphics.Models.PointsInstancedModel.create({
            ...data.points!,
            instancePositions: this.instanceModel.positions,
            instanceDots: this.instanceModel.dots,
            centroid: data.points!.centroid,
        }, unfs);
        this.context.add(points);
    }
    
    private addMesh(data: MetacityLoaderOutput) {
        if (!this.context)
            return;

        if (data.mesh) {
            const mesh = MetacityGL.Graphics.Models.MeshModel.create(data.mesh);
            if (this.pickable)
                this.context.add(mesh, data.mesh.metadata);
            else
                this.context.add(mesh);
        }
    }
}