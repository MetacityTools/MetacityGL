import * as Utils from "../../../utils"

function computeColorTable(styles: Utils.Styles.Style[], baseColor: Utils.Types.Color, metadataTable: Utils.Types.Metadata) {
    const colorTable = new Map<number, number[]>();
    for (const obj in metadataTable) {
        let color = baseColor;
        for (let i = 0; i < styles.length; i++)
            color = styles[i].apply(metadataTable[obj]) ?? color;
        colorTable.set(parseInt(obj), color);
    }
    return colorTable;
}


function computeColorBuffer(ids: Uint8Array, colorBuffer: Uint8Array, colorTable: Map<number, number[]>) {
    const idBuffer = new Uint8Array(4);
    const view = new DataView(idBuffer.buffer);
    idBuffer[0] = 0;

    const idToNumber = (offset: number) => {
        idBuffer[1] = ids[offset];
        idBuffer[2] = ids[offset + 1];
        idBuffer[3] = ids[offset + 2];
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


export function applyStyle(styles: string[], baseColor: Utils.Types.Color, ids: Uint8Array, colorBuffer: Uint8Array, metadata: Utils.Types.Metadata) {
    const stylesCls = [];
    for (let i = 0; i < styles.length; i++)
        stylesCls.push(Utils.Styles.Style.deserialize(styles[i]));

    const colorTable = computeColorTable(stylesCls, baseColor, metadata);
    computeColorBuffer(ids, colorBuffer, colorTable);
}