import React from "react";
import * as MetacityGL from "../../metacitygl";
import { TreeLayer } from "./layers/tree";
import { TreeLayerProps } from "./props";



function Range(props: { layer: TreeLayer }) {

    return (
        <input type="range" name="grayscale" min={0} max={1} step={0.01}
            onChange={(e) => {
                props.layer.setGrayscale(parseFloat(e.target.value));
            }}
        />
    );
}
export function MetacityTreeLayer(props: TreeLayerProps) {;
    const { context, children, onLoaded, skipObjects } = props;
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
        if (context && layerInit && onLoaded) {
            layer.setup(onLoaded);
        }
    }, [context, layerInit]);
    

    return (<>
        {children}
    </>);
}

