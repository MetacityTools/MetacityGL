

export function computeBBox(vertices: Float32Array|number[]) {
    const bbox = [
        [ Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE ],
        [ -Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE ]
    ];

    let x, y, z;
    for (let i = 0; i < vertices.length; i += 3) {
        x = vertices[i];
        y = vertices[i + 1];
        z = vertices[i + 2];

        bbox[0][0] = Math.min(bbox[0][0], x);
        bbox[0][1] = Math.min(bbox[0][1], y);
        bbox[0][2] = Math.min(bbox[0][2], z);

        bbox[1][0] = Math.max(bbox[1][0], x);
        bbox[1][1] = Math.max(bbox[1][1], y);
        bbox[1][2] = Math.max(bbox[1][2], z);
    }

    return bbox;
}