import React from "react";
import { Graphics } from "../metacitygl";


export interface TimelineProps {
    context?: Graphics.GraphicsContext;
}

const DEAFULT_SPEED = 16;

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function secondsToHms(seconds: number) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor(seconds % (3600 * 24) / 3600).toString().padStart(2, "0");
    const minutes = Math.floor(seconds % 3600 / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");

    const dayName = dayNames[(days) % 7];

    return `${dayName} ${hours}:${minutes}:${s}`;
    //return seconds.toString();
}

export function Timeline(props: TimelineProps) {
    const [speed, setSpeed] = React.useState(0);
    const [running, setRunning] = React.useState(false);
    const [time, setTime] = React.useState(0);
    const [timeStart, setTimeStart] = React.useState(0);
    const [timeEnd, setTimeEnd] = React.useState(0);
    const [initialized, setInitialized] = React.useState(false);

    React.useEffect(() => {
        if (props.context) {
            props.context.onBeforeFrame = (time) => {
                setTime(time);
                const timeframe = props.context?.timeframe;
                if (timeframe) {
                    setTimeStart(timeframe[0]);
                    setTimeEnd(timeframe[1]);
                }

                const timeRunning = props.context?.timeRunning;
                if (timeRunning !== undefined && !initialized) {
                    setInitialized(timeRunning);
                }
            }
        }
    }, [props.context]);

    React.useEffect(() => {
        if (props.context && initialized) {
            setRunning(true);
            setSpeed(DEAFULT_SPEED);
        }
    }, [props.context, initialized]);

    React.useEffect(() => {
        if (props.context)
            props.context.speed = speed;
    }, [speed, props.context]);


    const updateTime = (e: any) => {
        const t = parseInt(e.target.value);
        setTime(t);
        if (props.context)
            props.context.time = t;
    }

    const updateSpeed = (e: any) => {
        if (!initialized)
            return;

        const t = parseInt(e.target.value);
        setSpeed(t);
        if (t > 0)
            setRunning(true);
        else
            setRunning(false);
    }

    const togglePlay = () => {
        if (!initialized)
            return;

        if (running) {
            setSpeed(0);
            setRunning(false);
        }
        else {
            setSpeed(DEAFULT_SPEED);
            setRunning(true);
        }
    }

    if (initialized)
        return (<div className="timelineControls">
                    <div className="timelabel">{secondsToHms(time)}</div>
                    <div className="play" onClick={togglePlay}>{running ? String.fromCharCode(9632) : String.fromCharCode(9658)}</div>
                    <input type="range" name="timeline" className="timeline"
                        min={timeStart}
                        max={timeEnd}
                        step={1}
                        value={time}
                        onChange={updateTime}
                        disabled={!initialized}
                    />
                    <select name="speed" className="speed" value={speed} onChange={updateSpeed}>
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
                </div>);
     return (<div className="timelineControls">
            <div className="timelabel">loading...</div>
        </div>)
}


