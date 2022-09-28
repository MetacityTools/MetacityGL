import { vec3 } from "../../types";



export function gridXY(from: number[], to: number[], z: number, major: number, divideMajor: number) {
    const xMajor = [];
    const yMajor = [];
    const xMinor = [];
    const yMinor = [];
    const minor = major / divideMajor;

    const xFrom = Math.floor(from[0] / major) * major;
    const yFrom = Math.floor(from[1] / major) * major;
    const xTo = Math.ceil(to[0] / major) * major;
    const yTo = Math.ceil(to[1] / major) * major;

    for (let x = xFrom; x <= xTo; x += minor) {
        if(x % major === 0) {
            xMajor.push(x, yFrom, z, x, yTo, z);
        } else {
            xMinor.push(x, yFrom, z, x, yTo, z);
        }
    }

    for (let y = yFrom; y <= yTo; y += minor) {
        if(y % major === 0) {
            yMajor.push(xFrom, y, z, xTo, y, z);
        } else {
            yMinor.push(xFrom, y, z, xTo, y, z);
        }
    }

    return {
        majors: new Float32Array([...xMajor, ...yMajor]),
        minors: new Float32Array([...xMinor, ...yMinor])
    };
}