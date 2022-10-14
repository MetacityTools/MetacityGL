import * as MetacityGL from "../../metacitygl";

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