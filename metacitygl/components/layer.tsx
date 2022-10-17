import { GraphicsContext } from "../graphics";


export interface MetacityLayerProps {
    context?: GraphicsContext;
    enableTimeline?: boolean;
    enableUI?: boolean;
    onLoaded?: CallableFunction;
}
