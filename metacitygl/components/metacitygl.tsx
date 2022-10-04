import React from "react";
import "./style.css"
import { GraphicsContext } from "../graphics/context";
import { Timeline } from "./timeline";
import { MetacityLabel } from "./label";
import { MetacityLayerProps } from "./layer";


interface MetacityGLProps {
    background?: number;
    children?: React.ReactNode | React.ReactNode[];
}

export function MetacityGL(props: MetacityGLProps) {
    const [context, setContext] = React.useState<GraphicsContext>();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [hoverId, setHoverId] = React.useState<number|null>(0);
    const [metadataHover, setMetadataHover] = React.useState<any>(0);
    const [hoverLocation, setHoverLocation] = React.useState<{ x: number, y: number }|null>(null);
    const children = React.Children.toArray(props.children);

    const [enableTimeline, setEnableTimeline] = React.useState<boolean>(false);
    const [enableUI, setEnableUI] = React.useState<boolean>(false);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        
        if (canvas && container) {
            const context = new GraphicsContext({
                canvas: canvas,
                container: container,
                background: props.background ?? 0x000000,
            });
            setContext(context);
            context.updateSize();

            canvas.onpointerup = () => {
                context?.navigation.update();
            }
        }
    }, [canvasRef, containerRef]);

    const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        //TODO implement hover
        const x = e.clientX;
        const y = e.clientY;
        const rect = e.currentTarget.getBoundingClientRect();
        const xNorm = (x - rect.left);
        const yNorm = (y - rect.top);

        if(context) {
            const data = context.pick(xNorm, yNorm);
            if (data) {
                if (data.id !== hoverId) {
                    setHoverId(data.id);
                    setMetadataHover(data.metadata);
                    setHoverLocation({ x: xNorm, y: yNorm });
                }
            } else {
                setHoverId(null);

            }
        }
    };

    React.useEffect(() => {
        for (let child of children) {
            if (React.isValidElement(child)) {
                const childProps = child.props as MetacityLayerProps;
                if (childProps.enableTimeline) {
                    setEnableTimeline(true);
                }
                if (childProps.enableUI) {
                    setEnableUI(true);
                }
            }
        }
    }, [children]);




    window.onresize = () => {
        if (context)
            context.updateSize();
    };


    return (
        <div className="MetacityGLContainer">
            <div className="RenderingAreaContainer">
                <div className="CanvasContainer" ref={containerRef}>
                    <canvas ref={canvasRef} onPointerMove={onMove}></canvas>
                    ({hoverId != null && 
                        <div 
                            className="hoverDialog"
                            style={{
                                position: "absolute",
                                left: hoverLocation?.x,
                                top: hoverLocation?.y,
                            }}
                        >
                            <pre>{JSON.stringify(metadataHover, null, 2) }</pre>
                        </div>
                    })
                </div>
            { enableTimeline && <Timeline context={context}/> }
            </div>
            { enableUI && <div className="MetacityGLSidebar">
                {children.map((child, index) => {
                    if (React.isValidElement<MetacityLayerProps>(child)) {
                        return React.cloneElement(child, { context: context });
                    }
                })}
                <MetacityLabel context={context}/>
            </div> }
        </div>
    );
}


