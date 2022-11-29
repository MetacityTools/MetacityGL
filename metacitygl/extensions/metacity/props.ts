import * as MetacityGL from "../../metacitygl";
import { Types } from "../../utils";
import { TreeConfig } from "./tree/types";

export interface LayerProps extends MetacityGL.MetacityLayerProps {
    api: string;
    pickable?: boolean;
    color?: Types.Color | number;
    colorPlaceholder?: Types.Color | number;
    styles?: MetacityGL.Utils.Styles.Style[];
    radius?: number;
    instance?: string;
    size?: number;
    swapDistance?: number;
    children?: React.ReactNode;
    skipObjects?: number[];
    glare?: boolean;
}

export interface TreeLayerProps extends LayerProps {
    tree: TreeConfig;
}
