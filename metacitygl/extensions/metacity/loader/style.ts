import * as Utils from "../../../utils"

function computeColorTable(styles: Utils.Styles.Style[], baseColor: number, metadataTable: Utils.Types.Metadata) {
    const colorTable = new Map<number, number[]>();
    for (const obj in metadataTable) {
        let color = baseColor;
        for (let i = 0; i < styles.length; i++)
            color = styles[i].apply(metadataTable[obj]) ?? color;
        colorTable.set(parseInt(obj), Utils.Color.colorHexToArr(color));
    }
    return colorTable;
}


function computeColorBuffer(ids: Float32Array, colorBuffer: Float32Array, colorTable: Map<number, number[]>) {
    const idBuffer = new Uint8Array(4);
    const view = new DataView(idBuffer.buffer);
    idBuffer[0] = 0;

    const idToNumber = (offset: number) => {
        idBuffer[1] = ids[offset] * 255;
        idBuffer[2] = ids[offset + 1] * 255;
        idBuffer[3] = ids[offset + 2] * 255;
        return view.getInt32(0);
    };

    let id, color;
    for (let offset = 0; offset < ids.length; offset += 3) {
        id = idToNumber(offset);
        color = colorTable.get(id);
        if (color) {
            colorBuffer[offset] = color[0];
            colorBuffer[offset + 1] = color[1];
            colorBuffer[offset + 2] = color[2];
        }
    }
    return colorBuffer;
}


export function applyStyle(styles: string[], baseColor: number, ids: Float32Array, colorBuffer: Float32Array, metadata: Utils.Types.Metadata) {
    const stylesCls = [];
    for (let i = 0; i < styles.length; i++)
        stylesCls.push(Utils.Styles.Style.deserialize(styles[i]));

    const colorTable = computeColorTable(stylesCls, baseColor, metadata);
    computeColorBuffer(ids, colorBuffer, colorTable);
}