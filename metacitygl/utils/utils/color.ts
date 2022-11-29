import { Types } from "../../utils";

function lerpColor(a: Types.Color, b: Types.Color, fade: number) : Types.Color {
    return [
        a[0] + (b[0] - a[0]) * fade,
        a[1] + (b[1] - a[1]) * fade,
        a[2] + (b[2] - a[2]) * fade
    ];
}

export function linearInterpolateColor(colorHexMap: Types.Color[], index: number) {
    if (colorHexMap.length == 1) {
        return colorHexMap[0];
    }
    const index0 = Math.floor(index * (colorHexMap.length - 1));
    const index1 = Math.min(index0 + 1, colorHexMap.length - 1);
    const F = 1 / (colorHexMap.length - 1);
    const fade = (index - index0 * F) / F;
    return lerpColor(colorHexMap[index0], colorHexMap[index1], fade);

}

export function sampleColor(color: Types.Color | Types.Color[], indicator: number) {
    if (Array.isArray(color[0])) {
        return linearInterpolateColor(color as Types.Color[], indicator);
    }
    return color as Types.Color;
}

export function colorHexToArr(hex: number): [number, number, number] {
    const r = ( hex >> 16 & 255 ) / 255;
    const g = ( hex >> 8 & 255 ) / 255;
    const b = ( hex & 255 ) / 255;
    return [r, g, b];
}

export function colorStrToHex(color: string) {
    return parseInt(color.replace('#', ''), 16);
}

export function colorStrToArr(str: string): Types.Color {
    const hex = colorStrToHex(str);
    return colorHexToArr(hex);
}

export function colorHexToStr(hex: number): string {
    return '#' + hex.toString(16).padEnd(6, '0');
}

export function parseColor(color: Types.ColorInput | undefined) : Types.Color | undefined {
    if (color === undefined) {
        return undefined;
    } else if (typeof color === 'number') {
        return colorHexToArr(color);
    } else if (typeof color === 'string') {
        return colorStrToArr(color);
    } else if (Array.isArray(color)) {
        if (color.length == 3 && color.every((c) => typeof c === 'number'))
            return color as Types.Color;
    } 

    throw new Error(`Invalid color: ${color}`);
}

export function parseColorArray(color: Types.ColorInput | Types.ColorInput[] | undefined) : Types.Color | Types.Color[] | undefined {
    if (color === undefined) {
        return undefined;
    } else if (Array.isArray(color)) {
        if (color.length == 3 && color.every((c) => typeof c === 'number'))
            return color as Types.Color;
        else
            return color.map((c) => parseColor(c) as Types.Color);
    } else {
        return parseColor(color);
    }
}
