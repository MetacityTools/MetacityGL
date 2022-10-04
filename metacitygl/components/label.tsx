import React from 'react';
import { Graphics } from "../metacitygl";

interface MetacityLabelProps {
    context?: Graphics.GraphicsContext;
}

export function MetacityLabel(props: MetacityLabelProps) {
    return (
        <div className="metacityLabel">
            <button className="appButton"
                onClick={() => {
                    if (props.context)
                        props.context.toggleStats();
                }}>Toggle Rendering Statistics</button>
            <div>Visualization powered by <a href="https://metacity.cc">MetacityGL</a></div>
        </div>
    );
}