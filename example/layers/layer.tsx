import { MetacityLayerProps, Loaders, Graphics } from "../../metacitygl/metacitygl";
import axios from "axios";
import React from "react";


interface LayerProps extends MetacityLayerProps {
    api: string;
    pickable?: boolean;
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
    const [loader, setLoader] = React.useState<Loaders.MetacityLoader>(new Loaders.MetacityLoader());
    const pickable = props.pickable ?? false;

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
                }, (data: any) => {
                    const model = Graphics.Models.MeshModel.create(data.mesh);

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