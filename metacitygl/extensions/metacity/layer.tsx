import * as MetacityGL from "../../metacitygl";
import { MetacityLoader } from "./loader/loader";
import axios from "axios";
import React from "react";
import { MetacityLoaderOutput } from "./loader/types";

type vec3 = MetacityGL.Utils.Types.vec3;

interface LayerProps extends MetacityGL.MetacityLayerProps {
    api: string;
    pickable?: boolean;
    color?: number;
    styles?: MetacityGL.Utils.Styles.Style[];
    radius?: number;
    pointInstanceModel?: string;
    size?: number;
    swapDistance?: number;

    children?: React.ReactNode;
    placeholderColor?: number;
}

interface MetacityTile {
    file: string;
    size: number;
    x: number;
    y: number;
    loaded?: boolean;
    placeholder?: MetacityGL.Graphics.Models.TileModel;
}

interface MetacityLayout {
    tileWidth: number;
    tileHeight: number;
    tiles: MetacityTile[];
}

interface InstancedPointsUniforms {
    size: number; 
    modelColor: [number, number, number]; 
    swapDistance: number;
};


export function MetacityLayer(props: LayerProps) {
    const { api, context, children, pointInstanceModel } = props;
    const [layout, setLayout] = React.useState<MetacityLayout>();
    const [instanceModel, setInstanceModel] = React.useState<any>();
    const pickable = props.pickable ?? false;
    const color = props.color ?? 0xffffff;
    const placeholderColor = props.placeholderColor ?? 0x000000;
    const radius = props.radius ?? 2500;
    const swapDistance = props.swapDistance ?? 1000;
    const size = props.size ?? 1;
    let styles: string[] = [];

    if (props.styles) {
        for (let style of props.styles) {
            styles.push(style.serialize());
        }
    }

    React.useEffect(() => {
        const url = api + "/layout.json";
        axios.get(url).then((response) => {
            const layout = response.data;
            setLayout(layout);
        }
        );
    }, [api]);


    React.useEffect(() => {
        if (context && pointInstanceModel) {
            context.services.gltf.loader.load({
                pointInstanceModel: pointInstanceModel!,
            }, (instance) => {
                setInstanceModel(instance);
            })
        }
    }, [context, pointInstanceModel])

    const dist = (xa: number, ya: number, xb: number, yb: number) => {
        return Math.sqrt(Math.pow(xa - xb, 2) + Math.pow(ya - yb, 2));
    }

    React.useEffect(() => {
        const assetsInit = ((pointInstanceModel && instanceModel) || !pointInstanceModel);
        if (layout && context && assetsInit) {
            initPlaceholders(layout, context);
            context.onNavChange = loadTiles;
            loadTiles(context.navigation.target, context.navigation.position);
        }
    }, [layout, context, pointInstanceModel, instanceModel]);

    return (
        <>
            {children}
        </>
    );

    function initPlaceholders(layout: MetacityLayout, context: MetacityGL.Graphics.GraphicsContext) {
        const c = MetacityGL.Utils.Color.colorHexToArr(placeholderColor);
        for (let tile of layout.tiles) {
            const cOff = (Math.random() - 1.0) * 15;
            const placeholder = MetacityGL.Graphics.Models.TileModel.create({
                center: [(tile.x + 0.5) * layout.tileWidth, (tile.y + 0.5) * layout.tileHeight, 0],
                width: layout.tileWidth * 0.95,
                height: layout.tileHeight * 0.95,
                color: [c[0] + cOff, c[1] + cOff, c[2] + cOff],
            });
            tile.placeholder = placeholder;
            context.add(placeholder);
        }
    }

    function loadTiles(target: vec3, _: vec3) {
        if (layout && context) {
            const dx = layout.tileWidth * 0.5;
            const dy = layout.tileHeight * 0.5;
            layout.tiles.forEach((tile) => {
                const d = dist(tile.x * layout.tileWidth + dx, tile.y * layout.tileHeight + dy, target.x, target.y);
                if (d < radius && !tile.loaded) {
                    loadTile(tile);
                }
            });
        }
    }

    function loadTile(tile: MetacityTile) {
        tile.loaded = true;
        //start animation
        tile.placeholder?.lighten();
        context?.services.metacity.loader.load({
            url: api + "/" + tile.file,
            tileSize: tile.size,
            color: color,
            styles: styles,
        }, (data: MetacityLoaderOutput) => {
            context?.remove(tile.placeholder!);
            addMesh(data);
            addPoints(data);
        });
    }

    function addPoints(data: MetacityLoaderOutput) {
        if (data.points) {
            const unfs = {
                size,
                modelColor: MetacityGL.Utils.Color.colorHexToArr(color),
                swapDistance,
            };
            if (pointInstanceModel) {
                addInstancedPoints(data, unfs);
            } else {
                const points = MetacityGL.Graphics.Models.PointModel.create(data.points, unfs);
                context!.add(points);
            }
        }
    }

    function addInstancedPoints(data: MetacityLoaderOutput, unfs: InstancedPointsUniforms) {
        const points = MetacityGL.Graphics.Models.PointsInstancedModel.create({
            ...data.points!,
            instancePositions: instanceModel.positions,
            instanceDots: instanceModel.dots,
            centroid: data.points!.centroid,
        }, unfs);
        context!.add(points);
    }

    function addMesh(data: MetacityLoaderOutput) {
        if (data.mesh) {
            const mesh = MetacityGL.Graphics.Models.MeshModel.create(data.mesh);
            if (pickable)
                context!.add(mesh, data.mesh.metadata);
            else
                context!.add(mesh);
        }
    }
}