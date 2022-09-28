import axios from "axios";
import { Graphics } from "../../../metacitygl/metacitygl"
import { LandUseData, LandUseLegendData } from "../data";


self.onmessage = async function(e) {
    const { landuseAPI, legendAPI, space } = e.data;
    const landuse = (await axios.get(landuseAPI)).data as LandUseData;
    const legend = (await axios.get(legendAPI)).data as LandUseLegendData;
    const { colorTypeMap, meshBuffers } = tiles(legend, landuse, space);
    const lineBuffers = boundries(landuse, colorTypeMap);

    self.postMessage({
        meshBuffers,
        lineBuffers
    });
}


function tiles(legend: LandUseLegendData, landuse: LandUseData, space: number) {
    const colorTypeMap = colorMap(legend);
    const asm = new Graphics.Assemblers.MeshAssembler();
    for (const landuseID in landuse.data.areas) {
        const area = landuse.data.areas[landuseID];
        const color = colorTypeMap[area.use];
        for (let i = 0; i < area.tiles.length; ++i) {
            const tile = area.tiles[i];
            const square = cwRotatedSquare(tile.x, tile.y, tile.width - space, tile.rotation);
            asm.addMesh(
                square,
                color,
                {} //no metadata for now
            );
        }
    }

    const meshBuffers = asm.toBuffers();
    return { colorTypeMap, meshBuffers };
}

function boundries(landuse: LandUseData, colorTypeMap: { [key: string]: number[]; }) {
    const asm2 = new Graphics.Assemblers.LineAssembler();
    const tmp = new Graphics.Types.vec3();
    const tmp2 = new Graphics.Types.vec3();
    for (const landuseID in landuse.data.areas) {
        const area = landuse.data.areas[landuseID];
        const color = colorTypeMap[area.use];
        for (let i = 0; i < area.boundary.length; ++i) {
            const next = (i + 1) % area.boundary.length;
            asm2.addEdge(
                tmp.set(area.boundary[i].x, area.boundary[i].y, 0),
                tmp2.set(area.boundary[next].x, area.boundary[next].y, 0),
                color,
                {} //no metadata for now
            );
        }
    }

    const lineBuffers = asm2.toBuffers();
    return lineBuffers;
}


function cwRotatedSquare(cx: number, cy: number, diameter: number, angle: number) {
    let half = diameter / 2;
    let x = half, y = half;

    function rotate(x: number, y: number, angle: number) {
        let cos = Math.cos(angle),
            sin = Math.sin(angle),
            nx = (cos * (x)) + (sin * (y)),
            ny = (cos * (y)) - (sin * (x));
        return [nx + cx, ny + cy, 0];
    }

    return [...rotate(x, y, angle), ...rotate(-x, y, angle), ...rotate(-x, -y, angle), 
        ...rotate(x, y, angle), ...rotate(-x, -y, angle), ...rotate(x, -y, angle)];
}

function colorMap(legend: LandUseLegendData) {
    const landuseTypes = legend.data.useTypes;
    const colorTypeMap: { [key: string]: number[]; } = {};
    for (const landuseType in landuseTypes) {
        const color = landuseTypes[landuseType].color;
        colorTypeMap[landuseType] = Graphics.Color.colorStrToArr(color);
    }
    return colorTypeMap;
}