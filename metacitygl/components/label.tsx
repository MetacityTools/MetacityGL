import React from 'react';
import { Graphics } from "../metacitygl";

interface MetacityLabelProps {
    context?: Graphics.GraphicsContext;
}

export function MetacityLabel(props: MetacityLabelProps) {
    return (
        <div className="metacityLabel">
            <div>Visualization powered by <a href="https://metacity.cc">MetacityGL</a></div>
        </div>
    );
}