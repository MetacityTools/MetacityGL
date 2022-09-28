function capLeftHalf(resolution: number) {
    let vertices = [];
    const shift = Math.PI;
    const step = Math.PI / 2 / resolution;

    for (let i = 0; i < resolution; ++i) {
        vertices.push(0, 0, 0);
        vertices.push(Math.cos(shift + step * i), Math.sin(shift + step * i), 0);
        vertices.push(Math.cos(shift + step * (i + 1)), Math.sin(shift + step * (i + 1)), 0);

    }

    return vertices
}

function capRightHalf(resolution: number) {
    let vertices = [];
    const shift = Math.PI;
    const step = Math.PI / 2 / resolution;

    for (let i = 0; i < resolution; ++i) {
        vertices.push(1, 0, 0);
        vertices.push(1 - Math.cos(shift + step * i), Math.sin(shift + step * i), 0);
        vertices.push(1 - Math.cos(shift + step * (i + 1)), Math.sin(shift + step * (i + 1)), 0);
    }

    return vertices;
}

export function halfsegment(resolution: number = 5) {
    let geometry = [
        0, -1, 0,
        1, -1, 0,
        1, 0, 0,
        0, -1, 0,
        1, 0, 0,
        0, 0, 0
    ];

    geometry = geometry.concat(capLeftHalf(resolution));
    geometry = geometry.concat(capRightHalf(resolution));
    return geometry;
}