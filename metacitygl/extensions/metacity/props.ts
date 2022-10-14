import * as MetacityGL from "../../metacitygl";
import { TreeConfig } from "./tree/types";

export interface LayerProps extends MetacityGL.MetacityLayerProps {
    api: string;
    pickable?: boolean;
    color?: number;
    colorPlaceholder?: number;
    styles?: MetacityGL.Utils.Styles.Style[];
    radius?: number;
    instance?: string;
    size?: number;
    swapDistance?: number;
    children?: React.ReactNode;
}

export interface TreeLayerProps extends LayerProps {
    tree: TreeConfig;
}
