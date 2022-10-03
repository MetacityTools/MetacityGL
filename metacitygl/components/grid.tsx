import React from "react";
import { Graphics } from "../metacitygl";


interface GridProps {
    context?: Graphics.GraphicsContext;
    from: [number, number],
    to: [number, number],
    z: number,
    major: number,
    divideMajor: number,
    color: number,
    thickness: number,
}

export function Grid(props: GridProps) {
    const { context, from, to, z, major, divideMajor, color, thickness } = props;
    const [model, setModel] = React.useState<Graphics.Models.GridModel>();

    React.useEffect(() => {
        if (context) {
            const model = Graphics.Models.GridModel.create({
                from,
                to,
                z,
                major,
                divideMajor,
                color,
            }, {
                thickness
            });
            setModel(model);
        }
    }, [context]);

    React.useEffect(() => {
        if (model && context)
            context!.add(model);
    }, [model, context]);

    return (null)
}