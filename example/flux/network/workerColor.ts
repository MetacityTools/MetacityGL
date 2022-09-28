import axios from "axios";
import { Graphics } from "../../../metacitygl/metacitygl"
import { NetworkData, NetworkLegendData, CountsData } from "../data";


self.onmessage = async function(e) {
    const { metadata, countAttrib, ids } = e.data;
    const colorMap = [0x0d0887, 0x7e03a8, 0xcc4778, 0xf89540, 0xf0f921];
    let min = Infinity, max = -Infinity;

    const colors = [];
    let id = 0;
    for (let i = 0; i < ids.length; i += 3) {
        id = colorToId(ids[i], ids[i + 1], ids[i + 2]);
        const data = metadata[id];
        if (data) {
            const val = data.counts[countAttrib];
            if (val < min) min = val;
            if (val > max) max = val;
        }
    }

    for (let i = 0; i < ids.length; i += 3) {
        id = colorToId(ids[i], ids[i + 1], ids[i + 2]);
        const data = metadata[id];
        if (data) {
            const val = data.counts[countAttrib];
            const factor = (val - min) / (max - min);
            const color = Graphics.Color.sampleColor(colorMap, factor);
            const arr = Graphics.Color.colorHex(color);
            colors.push(...arr);
        }
    }

    self.postMessage({
        colors: new Float32Array(colors),
        min: min,
        max: max
    });
}

function colorToId(r: number, g: number, b: number) {
    return (Math.floor(r * 255) << 16) | (Math.floor(g * 255) << 8) | (Math.floor(b * 255))
}

