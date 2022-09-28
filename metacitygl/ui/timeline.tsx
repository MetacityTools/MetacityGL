import React from "react";
import { MetacityGL } from "../metacitygl";

export interface TimelineProps {
    engine: MetacityGL;
}

export function Timeline(props: TimelineProps) {
    const [speed, setSpeed] = React.useState(1);
    const [running, setRunning] = React.useState(false);
    const [time, setTime] = React.useState(0);
    const [timeStart, setTimeStart] = React.useState(0);
    const [timeEnd, setTimeEnd] = React.useState(0);

    props.engine.onInit = () => {
        if (!props.engine.context)
            throw new Error("Trying to access unitialized context.");

        props.engine.context.onBeforeFrame = (time: number) => {
            setTime(time);
            const timeframe = props.engine.context?.timeframe;
            if (timeframe) {
                setTimeStart(timeframe[0]);
                setTimeEnd(timeframe[1]);
            }

            const timeRunning = props.engine.context?.timeRunning;
            if (timeRunning !== undefined) {
                setRunning(timeRunning && speed !== 0);
            }
        };
    }

    const updateTime = (e: any) => {
        const t = parseInt(e.target.value);
        setTime(t)
        if (props.engine.context)
            props.engine.context.time = t;
    }

    const updateSpeed = (e: any) => {
        const t = parseInt(e.target.value);
        setSpeed(t)
        if (props.engine.context)
            props.engine.context.speed = t;
    }

    return (
        <div id="timelineControls" style={
            {
                position: "absolute",
                bottom: "1rem",
                left: "1rem",
                width: "calc(100% - 4rem)",
                padding: "0.5rem",
                background: "rgba(255, 255, 255, 0.8)",
                borderRadius: "0.5rem",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }
        }>

            <input type="range" name="timeline" id="timeline"
                min={timeStart}
                max={timeEnd}
                step={1}
                value={time}
                onChange={updateTime}
                disabled={!running}
                style={
                    {
                        width: "90%",
                        WebkitAppearance: "none",
                        background: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "0.5rem",
                        height: "1rem",
                        padding: "0",
                        margin: "0",
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                    }
                }
            />
            <select name="speed" id="speed" defaultValue="1" onChange={updateSpeed}
                style={
                    {
                        background: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "0.5rem",
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                        padding: "0 0 0 1rem",
                        height: "1rem",
                        fontSize: "0.7rem",
                        boxSizing: "content-box",
                    }
                }>
                <option value="0">stopped</option>
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="4">4x</option>
                <option value="8">8x</option>
                <option value="16">16x</option>
                <option value="32">32x</option>
                <option value="64">64x</option>
                <option value="128">128x</option>
                <option value="256">256x</option>
            </select>
        </div>
    );
}


