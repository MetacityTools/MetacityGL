import * as MetacityGL from "../../metacitygl/metacitygl";
import axios from "axios";
import React from "react";


interface LayerProps extends MetacityGL.MetacityLayerProps {
    api: string;
    pickable?: boolean;
    color?: number;
    styles?: MetacityGL.Utils.Styles.Style[]
}

interface MetacityTile {
    file: string;
    size: number;
    x: number;
    y: number;
}

interface MetacityLayout {
    tileWidth: number;
    tileHeight: number;
    tiles: MetacityTile[];
}


export function MetacityLayer(props: LayerProps) {
    const { api, context } = props;
    const [layout, setLayout] = React.useState<MetacityLayout>();
    const [loader] = React.useState<MetacityGL.Loaders.MetacityLoader>(new MetacityGL.Loaders.MetacityLoader());
    const pickable = props.pickable ?? false;
    const color = props.color ?? 0xffffff;
    let styles: string[] = [];

    if (props.styles) {
        for(let style of props.styles) {
            styles.push(style.serialize());
        }
    }

    React.useEffect(() => {
        const url = api + "/layout.json";
        console.log("Fetching layout from " + url);

        axios.get(url).then((response) => {
            const layout = response.data;
            setLayout(layout);
        }
        );
    }, [api]);

    React.useEffect(() => {
        if (layout && context) {
            layout.tiles.forEach((tile) => {
                loader.load({
                    url: api + "/" + tile.file,
                    tileSize: tile.size,
                    color: color,
                    styles: styles,
                }, (data: any) => {
                    const model = MetacityGL.Graphics.Models.MeshModel.create(data.mesh);
                    if (pickable)
                        context.add(model, data.mesh.metadata);
                    else
                        context.add(model);
                });
            });
        }
    }, [layout, context]);

    return (null);
}