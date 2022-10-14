import React from "react";
import * as MetacityGL from "../../metacitygl";
import { TreeLayer } from "./layers/tree";
import { LayerProps } from "./props";




export function MetacityTreeLayer(props: LayerProps) {;
    const { context, children } = props;
    const [layerInit, setLayerInit] = React.useState<boolean>(false);
    const [layer] = React.useState<TreeLayer>(new TreeLayer(props));

    React.useEffect(() => {
        if (context) {
            layer.context = context;
        }
    }, [context]);

    React.useEffect(() => {
        if (context && layer.instance) {
            context.services.gltf.loader.load({
                pointInstanceModel: layer.instance!,
            }, (instance) => {
                layer.instanceModel = instance;
                setLayerInit(true);
            })
        } else {
            setLayerInit(true);
        }
    }, [context]);


    React.useEffect(() => {
        if (context && layerInit) {
            layer.setup();
        }
    }, [context, layerInit]);
    

    return (<>{children}</>);
}

