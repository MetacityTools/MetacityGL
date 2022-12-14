import React from "react";
import "./style.css"
import { GraphicsContext, UserInputProps } from "../graphics/context";
import { Timeline } from "./timeline";
import { MetacityLabel } from "./label";
import { MetacityLayerProps } from "./layer";
import { Utils } from "../metacitygl";

interface MetacityGLProps extends UserInputProps  {
    children?: React.ReactNode | React.ReactNode[];
    invertColors?: boolean;
}

export function MetacityGL(props: MetacityGLProps) {
    const [context, setContext] = React.useState<GraphicsContext>();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const LoaderRef = React.useRef<HTMLDivElement>(null);
    const [hoverId, setHoverId] = React.useState<number|null>(0);
    const [metadataHover, setMetadataHover] = React.useState<any>(0);
    const [tooltipOn, setTooltipOn] = React.useState<boolean>(false);
    const [hoverLocation, setHoverLocation] = React.useState<{ x: number, y: number }|null>(null);
    const children = React.Children.toArray(props.children);
    let layersLoaded = 0;
    const color = props.background ? Utils.Color.colorHexToStr(props.background) : "#000000";

    const [enableTimeline, setEnableTimeline] = React.useState<boolean>(false);
    const [enableUI, setEnableUI] = React.useState<boolean>(false);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        
        if (canvas && container) {
            const context = new GraphicsContext({
                canvas: canvas,
                container: container,
                ...props
            });
            setContext(context);
            context.updateSize();

            canvas.onpointerup = () => {
                context?.navigation.update();
            }

            let updateCall: NodeJS.Timeout;
            canvas.addEventListener('wheel', (e) => {
                clearTimeout(updateCall);
                updateCall = setTimeout(() => {
                    context?.navigation.update();
                    //TODO ideally calculate near and far to fit
                }, 20);
            });

            //Does not work in strict mode
            //return () => {
            //    window.location.reload();
            //};
        }
    }, [canvasRef, containerRef]);



    const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if(!tooltipOn)
            return;

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

    const onLoaded = () => {
        layersLoaded += 1;

        if (LoaderRef.current) {
            const container = LoaderRef.current.children[0]
            container.childNodes.forEach((child, index) => {
                if (index < layersLoaded) {
                    (child as HTMLElement).classList.add("loaded");
                }
            });
        }


        if (layersLoaded === children.length) {
            setTimeout(() => {
                if (LoaderRef.current) {
                    LoaderRef.current.style.opacity = "0";

                    setTimeout(() => {
                        if (LoaderRef.current) {
                            LoaderRef.current.style.display = "none";
                        }
                    }, 200);
                }
            }, 500);
        }
    };

    return (
        <div className="MetacityGLContainer">
            <div className="RenderingAreaContainer">
                <div className="CanvasContainer" ref={containerRef}>
                    <div id="loader"  className={(props.invertColors ? " invert" : "")} ref={LoaderRef} style={{
                        backgroundColor: color,
                    }}>
                        <div id="loadingBalls">
                            { children.map((_, index) => 
                                <div className={"loadingBlob"} key={index} style={{ animationDelay: `${Math.random()}s`}}/>
                            ) }
                        </div>
                        
                        <div id="loadingName">Loading &#x2022; Metacity Tools</div></div>
                    <canvas ref={canvasRef} onPointerMove={onMove}></canvas>
                    {hoverId != null && 
                        <div 
                            className="hoverDialog"
                            style={{
                                position: "absolute",
                                left: hoverLocation?.x,
                                top: hoverLocation?.y,
                                pointerEvents: "none",
                                display: tooltipOn ? "block" : "none",
                            }}
                        >
                            <pre>{JSON.stringify(metadataHover, null, 2) }</pre>
                        </div>
                    }
                </div>
            { enableTimeline && <Timeline context={context}/> }
            </div>
             <div className={"MetacityGLSidebar" + (props.invertColors ? " invert" : "")} style={{
                display: enableUI ? "block" : "none",
             }}>
                {children.map((child, index) => {
                    if (React.isValidElement<MetacityLayerProps>(child)) {
                        return React.cloneElement(child, { context: context, onLoaded });
                    }
                })}
                <div className="settings">
                <h2>Settings</h2>
                <label htmlFor="tooltipToggle" className="checkInput">
                    <input type="checkbox" id="tooltipToggle" checked={tooltipOn} onChange={(e) => setTooltipOn(e.target.checked)}/>
                    Show metadata on hover
                </label>
                </div>
                <MetacityLabel context={context}/>
            </div>
        </div>
    );
}


