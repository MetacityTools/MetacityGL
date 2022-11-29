

const SIZE = 2;

export function unitQuad() {
    return new Float32Array([
        -SIZE, -SIZE, 0,
        SIZE, -SIZE, 0,
        SIZE, SIZE, 0,
        -SIZE, -SIZE, 0,
        SIZE, SIZE, 0,
        -SIZE, SIZE, 0,
    ]);
}