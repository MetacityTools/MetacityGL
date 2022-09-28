import React from "react";
import { MetacityGL } from "./metacitygl";


export interface VisualizationCanvasProps {
    invertCopyrightColor?: boolean;
    hideCopyright?: boolean;
    engine: MetacityGL;
}

export function VisualizationCanvas(props: VisualizationCanvasProps) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (canvas && container) {
            props.engine.initialize({
                canvas,
                container,
            });
        }
    }, [canvasRef, containerRef, props.engine]);


    return (
        <div className="BananaGLContainer" ref={containerRef}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}


