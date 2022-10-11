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
    children?: React.ReactNode;
    pointInstanceModel?: string;
    size?: number;
}

interface MetacityTile {
    file: string;
    size: number;
    x: number;
    y: number;
    loaded?: boolean;
}

interface MetacityLayout {
    tileWidth: number;
    tileHeight: number;
    tiles: MetacityTile[];
}


export function MetacityLayer(props: LayerProps) {
    const { api, context, children, pointInstanceModel } = props;
    const [layout, setLayout] = React.useState<MetacityLayout>();
    const [loader] = React.useState<MetacityLoader>(new MetacityLoader());
    const pickable = props.pickable ?? false;
    const color = props.color ?? 0xffffff;
    const radius = props.radius ?? 2500;
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

    const dist = (xa: number, ya: number, xb: number, yb: number) => {
        return Math.sqrt(Math.pow(xa - xb, 2) + Math.pow(ya - yb, 2));
    }

    React.useEffect(() => {
        if (layout && context) {
            context.onNavChange = loadTiles;
            loadTiles(context.navigation.target, context.navigation.position);
        }
    }, [layout, context]);

    return (
        <>
            {children}
        </>
    );

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
        loader.load({
            url: api + "/" + tile.file,
            tileSize: tile.size,
            color: color,
            styles: styles,
        }, (data: MetacityLoaderOutput) => {
            addMesh(data);
            addPoints(data);
        });
    }

    async function addPoints(data: MetacityLoaderOutput) {
        if (data.points) {
            const unfs = { 
                size,
                modelColor: MetacityGL.Utils.Color.colorHexToArr(color)
            };

            if (pointInstanceModel) {
                const instance = await MetacityGL.Utils.loadGLTF(pointInstanceModel);
                const points = MetacityGL.Graphics.Models.PointsInstancedModel.create({
                    ...data.points,
                    instancePositions: instance.positions,
                    instanceNormals: instance.normals,
                    centroid: data.points.centroid,
                }, unfs);
                context!.add(points);
            } else {
                const points = MetacityGL.Graphics.Models.PointModel.create(data.points, unfs);
                context!.add(points);
            }
        }
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