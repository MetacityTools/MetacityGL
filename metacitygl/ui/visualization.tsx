import React from "react";
import { MetacityGL } from "../metacitygl";


export interface VisualizationProps {
    invertCopyrightColor?: boolean;
    hideCopyright?: boolean;
    children?: React.ReactNode | React.ReactNode[];
    engine: MetacityGL;
}

export function Visualization(props: VisualizationProps) {
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
            { props.children }
        </div>
    );
}


