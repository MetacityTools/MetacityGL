import * as MetacityGL from "../../metacitygl";
import axios from "axios";
import React from "react";
import { GridLayer } from "./layers/grid";
import { LayerProps } from "./props";


export function MetacityLayer(props: LayerProps) {
    const { context, children } = props;
    const [layoutInit, setLayoutInit] = React.useState<boolean>(false);
    const [instanceInit, setInstanceInit] = React.useState<boolean>(false);
    const [layer] = React.useState<GridLayer>(new GridLayer(props));
    
    React.useEffect(() => {
        if (context) {
            layer.context = context;
            const url = layer.api + "/layout.json";
            axios.get(url).then((response) => {
                const layout = response.data;
                layer.layout = layout;
                setLayoutInit(true);
            });
        }
    }, [context]);


    React.useEffect(() => {
        if (context && layer.instance) {
            context.services.gltf.loader.load({
                pointInstanceModel: layer.instance!,
            }, (instance) => {
                layer.instanceModel = instance;
                setInstanceInit(true);
            })
        } else {
            setInstanceInit(true);
        }
    }, [context]);

    React.useEffect(() => {
        if (instanceInit && context && layoutInit) {
            layer.setup();
        }
    }, [instanceInit, context, layoutInit]);

    return (
        <>
            {children}
        </>
    );
}