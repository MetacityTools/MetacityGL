


export function tileGeometry(center: number[], width: number, height: number) {
    const hh = height * 0.5;
    const hw = width * 0.5;

    //as triangles
    const positions = new Float32Array([
        center[0] - hw, center[1] - hh, center[2],
        center[0] + hw, center[1] - hh, center[2],
        center[0] + hw, center[1] + hh, center[2],
        center[0] - hw, center[1] - hh, center[2],
        center[0] + hw, center[1] + hh, center[2],
        center[0] - hw, center[1] + hh, center[2]
    ]);

    const dots = new Float32Array([
        0, 0, 0, 0, 0, 0
    ]);

    return { positions, dots };
}